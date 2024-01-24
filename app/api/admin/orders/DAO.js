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