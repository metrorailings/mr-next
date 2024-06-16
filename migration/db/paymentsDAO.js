import dbConnect from './driver.js';
import NewPayment from './newPayment.js';

export async function updatePayment(payment) {
	await dbConnect();

	try {
		return await NewPayment.updateOne({ 
				_id: payment._id
			}, payment, {
			upsert: true
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getPaymentsByOrder(orderId) {
	await dbConnect();

	try {
		return await NewPayment.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}