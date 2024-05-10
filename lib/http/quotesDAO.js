import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';
import { cookies } from 'next/headers';

import Quotes from 'lib/models/quote';

export async function getQuote(orderId, seq) {
	await dbConnect();
	logServerDatabaseCall('lib/http/quotesDAO/getQuote', ...arguments);

	try {
		return await Quotes.findOne({ _id: orderId + '-' + seq }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for creating a new quote based off whatever details are present within an order
 *
 * @param {Order} order
 */
export async function createNewQuote(order) {
	await dbConnect();
	logServerDatabaseCall('lib/http/quotesDAO/createNewQuote', ...arguments);

	const username = JSON.parse(cookies().get('user')).username;

	let newQuote = {
		...order, // Keep in mind that the only properties of the order that will actually be saved are the ones explicitly defined in the Mongoose schema
		_id: order._id + '-' + (order.sales.quoteSeq + 1),
		orderId: order._id,
		quoteStatus: 'open',
		termsFileHandle: process.env.CURRENT_TERMS_AND_CONDITIONS,
		dates: {
			created: new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		await Quotes.create(newQuote);
		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}
