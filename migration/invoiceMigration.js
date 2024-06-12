import { createNewQuoteInvoice } from './db/invoicesDAO.js';
import { getAllOrders, updateOrder } from './db/ordersDAO.js';

const orders = await getAllOrders();

for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];
	const payments = order.payments?.charges || [];

	order.invoices = [];
	if (order.pricing?.depositAmount && payments.length) {
		const depositInvoice = createNewQuoteInvoice(order, payments[0].amount, payments[0].date);
		order.invoices.push(depositInvoice._id);
	}
}

console.log('Done!');
process.exit();