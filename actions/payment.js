'use server'

import stripe from 'stripe';
import { put } from '@vercel/blob';
import randomStr from 'randomstring';
import { cookies } from 'next/headers'

import { getOrderById, attachNewCard, attachNewPayment, attachStripeCustomerProfileData } from 'lib/http/ordersDAO';

const striper = stripe(process.env.STRIPE_SECRET_KEY);

const addCustomer = async (order) => {
	try {
		// Create a new Customer in Stripe so that we can store and reuse credit cards for a given order
		const stripeCustomer = await striper.customers.create({
			description: order._id,
			email: order.customer.email[0] || '',
			name: order.customer.company || order.customer.name
		});

		const processedCustomer = {
			id: stripeCustomer.id,
			createdOn: new Date(stripeCustomer.created)
		};

		// Associate the Stripe customer with the order in our system
		await attachStripeCustomerProfileData(order._id, processedCustomer);

		return processedCustomer;
	} catch (error) {
		console.error(error);
		return false;
	}
}

const addCreditCard = async (data, order) => {
	try {
		// Use Stripe to register the credit card
		const paymentCharge = await striper.paymentMethods.create({
			type: 'card',
			card: {
				number: data.cardNumber.split(' ').join(''),
				exp_month: data.expiration.split('/')[0],
				exp_year: data.expiration.split('/')[1],
				cvc: data.cardCode
			}
		});

		const processedCard = {
			id: paymentCharge.id,
			brand: paymentCharge.card.brand,
			exp_month: paymentCharge.card.exp_month,
			exp_year: paymentCharge.card.exp_year,
			last4: paymentCharge.card.last4
		};

		// Record the card in our own database
		await attachNewCard(order._id, processedCard);

		return processedCard;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const chargeCard = async (data, order) => {
	try {
		if (order?._id) {
			// Use Stripe to process the payment using the credit card specified in the parameters
			const paymentIntent = await striper.paymentIntents.create({
				amount: parseInt(data.paymentAmount * 100),
				currency: 'usd',
				confirm: true,
				customer: order.payments.customer.id,
				payment_method: data.card,
				metadata: { orderId: order._id, customer: order.customer?.name, company: order.customer?.company || 'N/A' },
				receipt_email: order.customer?.email[0] || process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
				statement_descriptor: ('Metro Railings ' + order._id),
				setup_future_usage: 'off_session',
				automatic_payment_methods: {
					allow_redirects: 'never',
					enabled: true
				}
			});
			if (paymentIntent.status === 'succeeded') {
				try {
					await attachNewPayment(order._id, paymentIntent);
				} catch (error) {
					console.error('Weird error updating the database after a successful Stripe transaction...');
					console.error(error);
				}

				return true;
			} else {
				console.error(paymentIntent.status);
				console.error(paymentIntent.last_payment_error);
			}
		}

		return false;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export async function addCardAndPayByCard(data) {
	const order = await getOrderById(data.orderId);
	// Define a customer in Stripe if one hasn't been created yet for this order
	if (!(order.payments.customer)) {
		order.payments.customer = await addCustomer(order);
	}
	const registeredCard = await addCreditCard(data, order);
	if (registeredCard) {
		data.card = registeredCard.id;
		const paymentMade = await chargeCard(data, order);
		return { success: paymentMade, card: registeredCard };
	} else {
		return { success: false };
	}
}

export async function payByCard(data) {
	const order = await getOrderById(data.orderId);
	if (order.payments.customer === null) {
		order.payments.customer = await addCustomer(order);
	}
	const paymentMade = await chargeCard(data, order);
	return { success: paymentMade };
}

export async function payByImage(data) {
	// Generate a random name for the new check image prior to upload
	const paymentImage = data.paymentImage;
	const generatedName = randomStr.generate({ length : 9 }) + '.' + paymentImage.name.split('.').pop();
	const user = cookies().get('user')?.value ? JSON.parse(cookies().get('user')).username : 'Public';

	try {
		// Upload to Vercel using the blob API
		const paymentBlob = await put('payments/' + generatedName, paymentImage, { access: 'public' });

		// Store the uploaded image in our database
		const paymentImageMetadata = {
			url: paymentBlob.url,
			name: paymentBlob.pathname.split('/').pop(),
			alt: paymentBlob.pathname.split('/').pop(),
			uploader: user,
			uploadDate: new Date()
		};
		await attachNewPayment(data.orderId, paymentImageMetadata);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}