import OrderDetailsPage from "app/admin/orderDetails/client";

import { getOrderById } from "app/api/admin/orders/DAO";

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
	}

	return (
		<>
			<OrderDetailsPage jsonOrder={ JSON.stringify(order) } />
		</>
	);
};

export default OrderDetailsServer;