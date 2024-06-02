'use server'

import { getOrderById, attachNewCard, attachNewPayment, attachStripeCustomerProfileData } from 'lib/http/ordersDAO';
import { stripeAddCustomer, stripeAddCreditCard, stripeChargeCard, recordNewCardPayment, uploadPaymentImage, recordNewImagePayment } from 'lib/http/paymentsDAO';
import { finalizeInvoice } from 'lib/http/invoicesDAO';

export async function addCardAndPayByCard(data) {
	let paymentIntent = false;
	let registeredCard = false;

	try {
		const order = await getOrderById(data.orderId);
		// Define a customer in Stripe if one hasn't been created yet for this order
		// Make sure to link the Stripe customer with the order in our system
		if (!(order.payments.customer)) {
			order.payments.customer = await stripeAddCustomer(order);
			await attachStripeCustomerProfileData(order._id, order.payments.customer);
		}
		// Register the card in stripe
		// Make sure to note the registration details inside our database so that it can be charged again if needed
		registeredCard = await stripeAddCreditCard(data, order);
		if (registeredCard) {
			await attachNewCard(order._id, registeredCard);
			const paymentIntent = await stripeChargeCard({
				card: registeredCard.id,
				...data
			}, order);
			if (paymentIntent) {
				// Create a payment record and attach a reference of that payment record directly to the order
				const paymentRecord = await recordNewCardPayment(paymentIntent, order._id, registeredCard, order.customer.state, data.invoiceId);
				await attachNewPayment(order._id, paymentRecord._id, paymentRecord.amount);

				// If this payment follows from an invoice, update the invoice to mark it as paid
				if (data.invoiceId) {
					await finalizeInvoice(data.invoiceId);
				}
			}
		}
	} catch (error) {
		console.error(error);
	}

	// @TODO: Add logging here to indicate whether the payment was made, but unsuccessfully recorded in the system
	return { success: paymentIntent ? true : false, card: registeredCard || null };
}

export async function payByCard(data) {
	let paymentIntent = false;

	try {
		const order = await getOrderById(data.orderId);
		if (order.payments.customer === null) {
			order.payments.customer = await stripeAddCustomer(order);
		}
		paymentIntent = await stripeChargeCard(data, order);
		if (paymentIntent) {
			// Isolate the credit card responsible for the charge
			const card = order.payments.cards.find((card) => card.id === paymentIntent.payment_method);

			// Create a payment record and attach a reference of that payment record directly to the order
			const paymentRecord = await recordNewCardPayment(paymentIntent, order._id, card, order.customer.state, data.invoiceId);
			await attachNewPayment(order._id, paymentRecord._id, paymentRecord.amount);

			// If this payment follows from an invoice, update the invoice to mark it as paid
			if (data.invoiceId) {
				await finalizeInvoice(data.invoiceId);
			}
		}
	} catch (error) {
		console.error(error);
	}

	// @TODO: Add logging here to indicate whether the payment was made, but unsuccessfully recorded in the system
	return { success: paymentIntent ? true : false };
}

export async function payByImage(data) {
	try {
		const order = await getOrderById(data.orderId);

		// Upload the check image to storage first before noting it inside the database
		const uploadedPaymentImage = await uploadPaymentImage(data.paymentImage);
		const paymentRecord = await recordNewImagePayment(uploadedPaymentImage, data.orderId, data.paymentAmount, order.customer.state);
		await attachNewPayment(data.orderId, paymentRecord._id, paymentRecord.amount);
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}