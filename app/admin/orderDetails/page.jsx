import OrderDetailsPage from "app/admin/orderDetails/client";

import { getOrderById } from 'lib/http/ordersDAO';
import { getUsers } from 'lib/http/usersDAO';
import { sortNotes } from 'lib/utils';

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
		sortNotes(order.notes);
	}

	const users = await getUsers();
	const usernames = users.map((user) => user.username);

	return (
		<>
			<OrderDetailsPage jsonOrder={ JSON.stringify(order) } jsonUsers={ JSON.stringify(usernames) } />
		</>
	);
};

export default OrderDetailsServer;