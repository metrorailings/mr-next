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
		return await Orders.findById(parseInt(id, 10)).populate('notes').populate('files').exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function effectively attaching metadata for a particular file against a particular order
 *
 * @param {Object} metadata
 * @returns {Promise<Order>}
 */
export async function attachFileMetadata(metadata) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/fileMetadata');

	try {
		await Orders.findOneAndUpdate({
			_id: metadata.orderId
		}, {
			$push: { files: metadata }
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
 * Function attaching a new note to a particular order
 *
 * @param {Object} note
 * @returns {Promise<Order>}
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

export async function attachNewPayment(orderId, charge) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachNewCharge');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { 'payments.charges' : charge },
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}