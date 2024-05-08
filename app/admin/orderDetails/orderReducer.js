import { validateAllDesignFields } from 'app/admin/orderDetails/designValidation';

/**
 * Reducer function meant to govern all changes to the order object.
 * Only applies to Order General v1
 */
export default function orderReducer(order, action) {
	switch (action.type) {
		case 'genericOrderUpdate': {
			const updatedOrder = { ...order };
			let propPath = updatedOrder;
			let i = 0;

			for (i = 0; i < action.properties.length - 1; i += 1) {
				propPath = propPath[action.properties[i]];
			}
			propPath[action.properties[i]] = action.value;

			return updatedOrder;
		}
		case 'genericOrderUpdateNum': {
			const updatedOrder = { ...order };
			let propPath = updatedOrder;
			let i = 0;

			for (i = 0; i < action.properties.length - 1; i += 1) {
				propPath = propPath[action.properties[i]];
			}
			propPath[action.properties[i]] = parseFloat(action.value || 0);

			return updatedOrder;
		}
		case 'addNewEmail': {
			let emails = order.customer.email ? order.customer.email.split(',') : [];
			emails.push(action.email);

			return {
				...order,
				customer: {
					...(order.customer),
					email: emails.join(',')
				}
			};
		}
		case 'removeEmail': {
			let emails = order.customer.email.split(',');
			emails = emails.filter(emailAddr => emailAddr !== action.email);

			return {
				...order,
				customer: {
					...(order.customer),
					email: emails.join(',')
				}
			};
		}
		case 'designChanged': {
			let orderDesign = {
				...(order.design),
				[action.propName]: action.design
			};
			let orderDesignDesc = {
				...(order.designDescription),
				[action.propName]: action.designDesc
			};
			validateAllDesignFields(orderDesign, orderDesignDesc);

			return {
				...order,
				design: orderDesign,
				designDescription: orderDesignDesc
			};
		}
		case 'designDescriptionChanged': {
			return {
				...order,
				designDescription: {
					...(order.designDescription),
					[action.propName]: action.designDesc
				}
			}
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

