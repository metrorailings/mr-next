'use server'

import {
	updateInvoice
} from 'lib/http/invoicesDAO';

export async function cancelInvoice(data) {
	try {
		const processedInvoice = await updateInvoice(data.invoiceId, { status: 'cancelled' });
		return { success: true, invoice: JSON.stringify(processedInvoice) };
	} catch (error) {
		return { success: false };
	}
}