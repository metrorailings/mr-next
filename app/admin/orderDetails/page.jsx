import OrderDetailsPage from "app/admin/orderDetails/client";

import { getOrderById } from 'lib/http/ordersDAO';

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
	}

	return (
		<>
			<OrderDetailsPage jsonOrder={ JSON.stringify(order) }/>
		</>
	);
};

export default OrderDetailsServer;