import dbConnect from './driver.js';
import Invoices from './invoice.js';
import Counters from './counter.js';

import { MIGRATION_USER, AGREEMENT } from '../env.js';

export async function createNewQuoteInvoice(order, amountToPay, paid = false, cancelled = false) {
	await dbConnect();

	const username = MIGRATION_USER.USERNAME;

	// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const countersResult = await Counters.findByIdAndUpdate('invoices', { $inc: { seq: 1 } }).exec();
	
	const newQuote = {
		...order, // Keep in mind that the only properties from the order that will actually be saved into this invoice are the ones explicitly defined in the Mongoose schema
		_id: countersResult.seq,
		orderId: order._id,
		status: paid ? 'finalized' : (cancelled ? 'cancelled' : 'open'),
		category: 'quote',
		amount: amountToPay,
		termsFileHandle: AGREEMENT.PATH,
		dates: {
			created: new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		return await Invoices.create(newQuote);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}