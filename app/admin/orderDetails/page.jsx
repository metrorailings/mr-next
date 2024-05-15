import OrderDetailsPage from "app/admin/orderDetails/client";

import { getOrderById } from 'lib/http/ordersDAO';
import { getPrunedUserInformation } from 'lib/http/usersDAO';
import { sortNotes } from 'lib/utils';

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
		sortNotes(order.notes);
	}

	const users = await getPrunedUserInformation();

	return (
		<>
			<OrderDetailsPage jsonOrder={ JSON.stringify(order) } jsonUsers={ JSON.stringify(users) } />
		</>
	);
};

export default OrderDetailsServer;