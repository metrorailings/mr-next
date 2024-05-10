'use client'

import React, { useState } from 'react';

import PaymentForms from 'components/paymentForms';

import { publish } from 'lib/utils';

import styles from 'public/styles/page/quote.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const PrintButton = () => {
	const printPage = () => {
		const iframe = document.frames ? document.frames['terms'] : document.getElementById('terms');
		const iframeWindow = iframe.contentWindow || iframe;

		iframe.focus();
		iframeWindow.print();

		return false;
	};

	return (
		<>
			<button type='button' className={ styles.printButton } onClick={ printPage }>
				Print <FontAwesomeIcon icon={ faPrint } className={ styles.printIcon }/>
			</button>
			<iframe id='terms' src='/quote/terms' className={ styles.printIframe } title='Terms and Conditions'/>
		</>
	);
};

const FinalizeSection = ({ termsText, jsonQuote }) => {
	const [termsAccepted, setTermsAccepted] = useState(false);

	const quote = JSON.parse(jsonQuote);

	const openModal = () => {
		publish('open-info-modal', {
			modalMarkdown: termsText,
			ModalJSXButtons: PrintButton
		});
	};

	const finalizeOrder = () => {
		console.log('Order finalized!');
	}

	return (
		<>
			<div className={ styles.termsAcceptedSection }>
				<input id='termsAccepted' type='checkbox' className={ styles.termsAcceptedCheckbox } checked={ termsAccepted } readOnly />
				<label onClick={() => setTermsAccepted(!termsAccepted) }></label>
				<span className={ styles.termsAcceptedLabel }>I have read and accepted the <span className={ styles.termsAndConditionsLink } onClick={ openModal } >terms and conditions</span>.</span>
			</div>
			<div className={ styles.paymentSection }>
				{ !(termsAccepted) ? (
					<div className={ styles.paymentSectionOverlay }>
						<div className={ styles.paymentSectionOverlayNotice }>Please mark the checkbox above first indicating that you have read and agreed with the Terms and Conditions.</div>
					</div>
				) : null }
				<PaymentForms
					orderId={ quote.orderId }
					acceptCard={ true }
					acceptAlternate={ false }
					cards={ false }
					postFunc={ finalizeOrder }
					balanceRemaining={ order.payments?.balanceRemaining }
					presetPaymentAmount={ order.pricing?.depositAmount }
					orderState={ order.customer?.state || '' }
				/>
			</div>
		</>
	);
}

export default FinalizeSection;