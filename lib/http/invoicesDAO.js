import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';
import { cookies } from 'next/headers';

import Invoices from 'lib/models/invoice';

export async function getInvoice(orderId, seq) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/getInvoice', ...arguments);

	try {
		return await Invoices.findOne({ _id: orderId + '-' + seq }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for creating a new quote based off whatever details are present within an order
 *
 * @param {Order} order
 * @param {Number} amountToPay
 */
export async function createNewQuoteInvoice(order, amountToPay) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/createNewQuoteInvoice', ...arguments);

	const username = JSON.parse(cookies().get('user').value).username;

	let newQuote = {
		...order, // Keep in mind that the only properties of the order that will actually be saved are the ones explicitly defined in the Mongoose schema
		_id: order._id + '-' + (order.sales.invoiceSeq + 1),
		orderId: order._id,
		status: 'open',
		category: 'quote',
		amount: amountToPay,
		termsFileHandle: process.env.CURRENT_TERMS_AND_CONDITIONS,
		dates: {
			created: new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		await Invoices.create(newQuote);
		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for creating a progress invoice based off whatever details are present within an order
 *
 * @param {Order} order
 * @param {Number} amountToPay
 */
export async function createNewProgressInvoice(order, amountToPay) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/createNewProgressInvoice', ...arguments);

	const username = JSON.parse(cookies().get('user').value).username;

	let newQuote = {
		...order, // Keep in mind that the only properties of the order that will actually be saved are the ones explicitly defined in the Mongoose schema
		_id: order._id + '-' + (order.sales.invoiceSeq + 1),
		orderId: order._id,
		status: 'open',
		category: 'progress',
		amount: amountToPay,
		termsFileHandle: '',
		dates: {
			created: new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		await Invoices.create(newQuote);
		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}
