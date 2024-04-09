import { httpRequest } from 'lib/http/serverHttpRequester';

export async function sendLeadEmail(data) {
	// Format the data before it's packaged and sent over the wire to Loop
	data.replyEmail = data.email || process.env.NEXT_PUBLIC_SUPPORT_MAILBOX;
	data.email = data.email || 'N/A';
	data.address = data.address || 'N/A';
	data.city = data.city || 'N/A';
	data.state = data.state || 'N/A';

	const postData = {
		email: process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
		transactionalId: process.env.LOOPS_LEAD_EMAIL_TRANSACTION_ID,
		dataVariables: data
	};

	const emailResult = await httpRequest('https://app.loops.so/api/v1/transactional', 'POST', postData, 'Bearer ' + process.env.LOOPS_API_KEY);
	if (emailResult.success === false) {
		throw new Error(emailResult);
	}
	return true;
}