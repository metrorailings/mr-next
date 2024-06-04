'use client'

import React, { useContext } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

import { OrdersContext } from 'app/admin/orderDetails/orderContext';

import { formatUSDAmount } from 'lib/utils';

import styles from 'public/styles/page/components.module.scss';
import visaLogo from 'assets/images/logos/visa.svg';
import amexLogo from 'assets/images/logos/amex.svg';
import mastercardLogo from 'assets/images/logos/mastercard.svg';
import discoverLogo from 'assets/images/logos/discover.svg';

const PaymentHistory = () => {

	const orderDetails = useContext(OrdersContext);

	const determineCardBrandToShow = (brand) => {
		switch (brand) {
			case 'visa':
				return visaLogo;
			case 'amex':
				return amexLogo;
			case 'discover':
				return discoverLogo;
			case 'mastercard':
				return mastercardLogo;
			default:
				return '';
		}
	};

	return (
		<div className={ styles.pastPaymentsTable }>
			{ orderDetails.payments.charges.map((payment) => {
				return (
					<div className={ styles.pastPaymentsRecord } key={ payment._id }>
						<span className={ styles.pastPaymentDataCard }>
							{ payment.type === 'card' ? (
								<>
									<Image
										src={ determineCardBrandToShow(payment.stripeMetadata.card.brand) }
										width={ 32 }
										height={ 32 }
										alt={ payment.stripeMetadata.card.brand }
									/>
									<span>(...{ payment.stripeMetadata.card.last4 })</span>
								</>
							) : (
								<Image src={ payment.imageMetadata.url } width={ 160 } height={ 90 } alt='Image payment'/>
							) }
						</span>
						<span className={ styles.pastPaymentDataAmount }>${ formatUSDAmount(payment.amount) }</span>
						{ payment.invoiceId ? (
							<span className={ styles.pastPaymentDataDate }>
								<div className={ styles.pastPaymentMinorData }>From Invoice</div>
								<div>{ payment.invoiceId }</div>
							</span>
						) : (
							<span className={ styles.pastPaymentDataDate }>
								<div className={ styles.pastPaymentMinorData }>Entered By</div>
								<div>{ payment.initiatedBy }</div>
							</span>
						)}
						<span className={ styles.pastPaymentDataDate }>
							<div className={ styles.pastPaymentMinorData }>Transaction Date</div>
							<div>{ dayjs(payment.date).format('MMM DD, YYYY') }</div>
						</span>
					</div>
				);
			}) }
		</div>
	);
}

export default PaymentHistory;