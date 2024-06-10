import { getAllOrders } from 'lib/http/ordersDAO';

// Open up a connection to the database
(async function (){
	let orders = await getAllOrders();

	console.log(orders);

	// Close out this program
	console.log('Done!');
	process.exit();
})();