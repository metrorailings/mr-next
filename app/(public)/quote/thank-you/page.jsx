'use server'

import { getUsersByUsername } from 'lib/http/usersDAO';
import { getOrderById } from 'lib/http/ordersDAO';

import styles from 'public/styles/page/thankYou.module.scss';

const ThankYouServer = async ({ searchParams }) => {
	const orderId = searchParams?.orderId || '';
	let order = {};
	let users = [];

	// If the order can be found, track down the order and the metadata for all the salespeople assigned to the order 
	if (orderId) {
		order = await getOrderById(orderId);
		const salesAssignees = order?.sales?.assignees || [];
		const usernames = salesAssignees.map((assignee) => { return assignee.username });
		users = await getUsersByUsername(usernames);
	}

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.pageHeader }>
				Thank you so much for choosing us!
			</div>
			<p className={ styles.infoText }>
				We have received your payment! We will now proceed forward with your order. If you have any more questions, feel free to reach out to the salespeople managing your order. Their information is listed below.
			</p>
			<div className={ styles.salesmanTable }>
				{ users.map((user, index) => {
					return (
						<div className={ styles.salesmanRow } key={ index }>
							<span className={ styles.salesmanName } key={ index }>{ user.fullName }</span>
							<span className={ styles.salesmanContactInfoCell }>
								<div className={ styles.salesmanContactInfo }>{ user.email }</div>
								<div className={ styles.salesmanContactInfo }>{ user.phone }</div>
							</span>
						</div>
					);
				}) }
			</div>
		</div>
	);
};

export default ThankYouServer;