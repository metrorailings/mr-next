import dbConnect from "lib/database";
import { logServerDatabaseCall } from "lib/logger";

import Orders from "lib/models/order";

/**
 * Function to retrieve all orders, period
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOrders() {
	await dbConnect();
	logServerDatabaseCall('api/admin/orders/getAllOrders');

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
	logServerDatabaseCall('api/admin/orders/getAllOpenOrders');

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
	logServerDatabaseCall('api/admin/orders/getOrderById');

	try {
		return await Orders.findById(parseInt(id, 10)).exec();
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
	logServerDatabaseCall('api/admin/orders/fileMetadata');

	try {
		const foundOrder = await Orders.findOne({
			_id : metadata.orderId
		}).exec();

		foundOrder.files = foundOrder.files || [];
		foundOrder.files.push(metadata);

		const res = await Orders.updateOne({ 
			_id : metadata.orderId
		}, {
			files : foundOrder.files
		}, {
			upsert : false
		});

		return res.modifiedCount === 1;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}