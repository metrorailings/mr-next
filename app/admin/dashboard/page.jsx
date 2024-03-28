import DashboardPage from "app/admin/dashboard/client";

import { getAllOpenOrders } from 'lib/http/ordersDAO';

const DashboardServer = async () => {
	// Fetch all open orders
	const orders = await getAllOpenOrders();

	return (
		<>
			<DashboardPage jsonOrders={ JSON.stringify(orders) } />
		</>
	);
};

export default DashboardServer;