'use client'

import React, { useState } from 'react';

import PaymentForms from 'components/paymentForms';
import TermsModal from 'app/(public)/quote/termsModal';

import styles from 'public/styles/page/quote.module.scss';

const FinalizeSection = ({ termsText, orderId, amountToPay, termsFileHandle, jsonCards }) => {
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);

	const openModal = () => {
		setShowTermsModal(true);
	};

	const closeModal = () => {
		setShowTermsModal(false);
	}

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
					orderId={ orderId }
					acceptCard={ true }
					acceptAlternate={ false }
					cards={ JSON.parse(jsonCards) }
					postFunc={ finalizeOrder }
					presetPaymentAmount={ amountToPay }
				/>
			</div>

			{ showTermsModal ? (
				<TermsModal markdownText={ termsText } termsFileHandle={ termsFileHandle } closeFunc={ closeModal } />
			) : null }
		</>
	);
}

export default FinalizeSection;