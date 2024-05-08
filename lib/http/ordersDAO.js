import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Orders from 'lib/models/order';
import Counters from 'lib/models/counters';

/**
 * Function to retrieve all orders, period
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOrders() {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getAllOrders');

	try {
		return await Orders.find().exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve all open orders
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOpenOrders() {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getAllOpenOrders');

	try {
		return await Orders.find().where('status').in(['material', 'layout', 'welding', 'grinding', 'painting', 'install', 'closing']).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve an order by ID
 *
 * @param {String}
 * @returns {Promise<Order>}
 */
export async function getOrderById(id = '') {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getOrderById');

	try {
		return await Orders.findOne({ _id: parseInt(id, 10) }).populate('notes').populate('files').exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function attaching a new note to a particular order
 *
 * @param {Object} note
 */
export async function addNewNoteToOrder(note) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/addNewNoteToOrder');

	try {
		await Orders.findOneAndUpdate({
			_id: note.orderId
		}, {
			$push: { notes: note }
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to save a brand new order (versus an existing one)
 *
 * @param {Order} the new order to save
 */
export async function saveNewOrder(order) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/saveNewOrder');

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('orders', { $inc: { seq: 1 } }).exec();
		order._id = countersResult.seq;

		await Orders.create(order);
		return order;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to link this order to a Stripe customer object
 */
export async function attachStripeCustomerProfileData(orderId, customer) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachStripeCustomerProfileData');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			'payments.customer' : customer,
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to record a credit card as a registerd form of payment on a given order
 */
export async function attachNewCard(orderId, card) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachNewCard');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { 'payments.cards' : card },
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to record a new payment made on against a given order
 */
export async function attachNewPayment(orderId, paymentId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachNewPayment', arguments);

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { 'payments.charges' : paymentId },
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function attaching an ID reference for a particular file against a particular order
 *
 * @param {Number} orderId
 * @param {Number} fileId
 */
export async function attachFileToOrder(orderId, fileId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachFileToOrder');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { files: fileId }
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function removing an ID reference for a particular file from a particular order
 *
 * @param {Number} orderId
 * @param {Number} fileId
 */
export async function deleteFileFromOrder(orderId, fileId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/deleteFileFromOrder');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		},{
			$pull: { files: fileId }
		},{
			upsert: false
		}).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for updating the status of an order
 *
 * @param {Number} orderId
 * @param {String} status
 */
export async function updateStatus(orderId, status) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/updateStatus');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			status: status
		}, {
			upsert: false
		}).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}