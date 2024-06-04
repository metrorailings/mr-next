'use server'

import {
	updateInvoice,
	createNewQuoteInvoice,
	createNewProgressInvoice
} from 'lib/http/invoicesDAO';

import {
	recordNewInvoice
} from 'lib/http/ordersDAO';

/**
 * Server action designed to generate a new invoice for a given order
 *
 * @param data - the order object to model the invoice off
 */
export async function generateInvoice(data) {
	const order = data.order;

	try {
		// Figure out what type of invoice to create here
		let isQuote = true;
		for (let i = 0; i < order.invoices.length; i += 1) {
			if (order.invoices[i].status === 'finalized') {
				isQuote = false;
			}
		}

		const processedInvoice = isQuote ? await createNewQuoteInvoice(order, data.amountToPay) : await createNewProgressInvoice(order, data.amountToPay);

		// Link the invoice to the order it's associated with
		await recordNewInvoice(order, processedInvoice._id);

		return { success: true, invoice: JSON.stringify(processedInvoice) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function cancelInvoice(data) {
	try {
		const processedInvoice = await updateInvoice(data.invoiceId, { status: 'cancelled' });
		return { success: true, invoice: JSON.stringify(processedInvoice) };
	} catch (error) {
		return { success: false };
	}
}