import dbConnect from './driver.js';
import Orders from './order.js';
import newOrders from './newOrder.js';

export async function getAllOrders() {
	await dbConnect();

	try {
		return await Orders.find().sort({ _id: 1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function updateOrder(order) {
	await dbConnect();

	try {
		await newOrders.updateOne({
			_id: order._id,
		}, order, {
			upsert: true
		}).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}