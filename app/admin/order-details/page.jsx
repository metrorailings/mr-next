import OrderDetailsPage from "app/admin/order-details/client";

import { getOrderById } from 'lib/http/ordersDAO';
import { sortNotes } from 'lib/utils';

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
		sortNotes(order.notes);
	}

	return (
		<>
			<OrderDetailsPage jsonOrder={ JSON.stringify(order) } />
		</>
	);
};

export default OrderDetailsServer;