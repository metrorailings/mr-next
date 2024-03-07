import { redirect } from 'next/navigation'

import OrderSearchPage from "app/admin/orderSearch/client";
import { filterOrders } from "app/admin/orderSearch/orderFilter";

import { getAllOrders } from "app/api/admin/orders/DAO";

const OrderSearchServer = async (request) => {

	const orders = await getAllOrders();
	const params = request.searchParams || {};

	// Should no filters be set in the URL, reset the URL to include default filters
	if (Object.keys(params).length === 0) {
		redirect('/admin/orderSearch?status=open')
	}

	const filteredOrders = filterOrders(orders, params);

	return (
		<>
			<OrderSearchPage
				jsonOrders={ JSON.stringify(orders) }
				jsonFilteredOrders={ JSON.stringify(filteredOrders) }
			/>
		</>
	);
};

export default OrderSearchServer;