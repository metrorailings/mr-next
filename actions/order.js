'use server'

import { validateEmail, validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { saveNewOrder } from 'lib/http/ordersDAO';
import { sendLeadEmail } from 'lib/loopMailer';

export async function createProspectFromContactUs(data) {

	let newOrder = {};

	const validationFields = [
		{ prop: data.name, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.phone, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.comments, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.email, validator: validateEmail, errorMsg: 'fail' }
	];

	try {
		// Just make sure the parameters are valid
		if (runValidators(validationFields).length === 0) {
			const phoneNumber = data.phone.split('-');

			newOrder.customer = {
				name: data.name,
				areaCode: phoneNumber[0],
				phoneOne: phoneNumber[1],
				phoneTwo: phoneNumber[2],
				address: data.address || '',
				city: data.city || '',
				state: data.state || '',
				emails: data.email ? [data.email] : []
			}

			await saveNewOrder(newOrder);
			await sendLeadEmail(data);
			return { success: true };
		}
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}