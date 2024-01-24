/**
 * A module designed to help us filter orders for display on the orderSearch page
 **/

// ----------------- CONSTANTS --------------------------

const statusDefinitions = {
	open: ['material', 'layout', 'welding', 'grinding', 'painting', 'install', 'closing'],
	shop: ['material', 'layout', 'welding', 'grinding', 'painting', 'install']
};

// ----------------- UTILITY FUNCTIONS --------------------------

// The sorting function that we will use to keep orders organized by modification date
function sortOrdersByModDate(a, b) {
	return ((new Date(a.dates.lastModified) < new Date(b.dates.lastModified)) ? 1 : -1 );
}

// The sorting function that we will use to keep orders organized by due date
function sortOrdersByDueDate(a, b) {
	// If no dates are present, then sort by modification date
	if ( !(a.dates.due) && !(b.dates.due) ) {
		return sortOrdersByModDate(a, b);
	}
	// If one of the orders is missing a due date, push it down the list
	else if ( !(a.dates.due) ) {
		return 1;
	} else if ( !(b.dates.due) ) {
		return -1;
	}

	return ( (new Date(a.dates.due) < new Date(b.dates.due)) ? -1 : 1 );
}

// Function meant to filter orders by a given status
function filterOrdersByStatus(orders, status) {
	if (!(status)) {
		return orders;
	} else if (status === 'open') {
		return orders.filter(order => statusDefinitions.open.find(status => order.status === status));
	} else if (status === 'shop') {
		return orders.filter(order => statusDefinitions.shop.find(status => order.status === status));
	} else {
		return orders.filter(order => order.status === status);
	}
}

// Function meant to filter orders given some search text
function filterOrdersBySearchText(orders, searchText = '') {
	searchText = searchText.toLowerCase();

	return orders.filter((order) => {
		let phoneNumber = '' + order.customer.areaCode + order.customer.phoneOne + order.customer.phoneTwo;

		// Stud the order with some empty strings prior to filtering
		order.customer.company = order.customer.company || '';
		order.customer.email = order.customer.email || '';
		order.customer.areaCode = order.customer.areaCode || '';
		order.customer.phoneOne = order.customer.phoneOne || '';
		order.customer.phoneTwo = order.customer.phoneTwo || '';
		order.customer.address = order.customer.address || '';
		order.customer.city = order.customer.city || '';
		order.customer.state = order.customer.state || '';

		// @TODO: Allow searching by design selections and notes as well
		// Note that the search text will only work on order IDs and customer information
		return ((order._id.toString().indexOf(searchText) >= 0) ||
			(order.customer.name.toLowerCase().indexOf(searchText) >= 0) ||
			(order.customer.company.toLowerCase().indexOf(searchText) >= 0) ||
			(order.customer.email.toLowerCase().indexOf(searchText) >= 0) ||
			(phoneNumber.indexOf(searchText) >= 0) ||
			(order.customer.address.toLowerCase().indexOf(searchText) >= 0) ||
			(order.customer.city.toLowerCase().indexOf(searchText) >= 0) ||
			(order.customer.state.toLowerCase().indexOf(searchText) >= 0));
	});
}

// Function that sorts a collection of orders by a prescribed method
function sortOrders(orders, sortBy) {
	switch (sortBy) {
		case 'dueDate': {
			orders.sort(sortOrdersByDueDate);
			break;
		}
		case 'lastModified': {
			orders.sort(sortOrdersByModDate);
			break;
		}
	}
}

// ----------------- MODULE DEFINITION --------------------------

// Function designed to filter a given set of orders using multiple filter criteria
export function filterOrders(orders, filters) {
	let filteredOrders = orders;

	filteredOrders = filterOrdersByStatus(filteredOrders, filters.status || 'open');
	filteredOrders = filterOrdersBySearchText(filteredOrders, filters.search || '');
	sortOrders(filteredOrders, filters.sort || 'lastModified');

	return filteredOrders;
}