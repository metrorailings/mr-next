import dbConnect from './driver.js';
import Payment from './payment.js';

export async function updatePayment(order, payment) {
	await dbConnect();

	try {
		return await Payment.updateOne({ 
				_id: payment._id
			}, payment, {
			upsert: false
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}