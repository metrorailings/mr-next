'use server'

import stripe from 'stripe';
import { put } from '@vercel/blob';
import randomStr from 'randomstring';
import { cookies } from 'next/headers'

import { getOrderById, attachNewCard, attachNewPayment } from 'lib/http/ordersDAO';

const striper = stripe(process.env.STRIPE_SECRET_KEY);

const addCreditCard = async (data) => {
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
		await attachNewCard(data.orderId, processedCard);

		return processedCard;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const chargeCard = async (data) => {
	try {
		const order = await getOrderById(data.orderId);

		if (order?._id) {
			// Use Stripe to process the payment using the credit card specified in the parameters
			const paymentIntent = await striper.paymentIntents.create({
				amount: parseFloat(data.paymentAmount),
				currency: 'usd',
				confirm: true,
				payment_method: data.card,
				metadata: { orderId: order._id, customer: order.customer?.name, company: order.customer?.company || 'N/A' },
				receipt_email: order.customer?.email[0] || process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
				statement_descriptor: ('Metro Railings - Order ' + order._id)
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
	const registeredCard = await addCreditCard(data);
	if (registeredCard) {
		data.card = registeredCard.id;
		const paymentMade = await chargeCard(data);
		return { success: paymentMade };
	} else {
		return { success: false };
	}
}

export async function payByCard(data) {
	const paymentMade = await chargeCard(data);
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