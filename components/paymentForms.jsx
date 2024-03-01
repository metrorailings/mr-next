'use client'

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { upload } from '@vercel/blob/client';
import toast from 'react-hot-toast';

import { validateNumberOnly } from "lib/validators/inputValidators";
import { getUserSession } from 'lib/userInfo';
import { PAYMENTS_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';
import { publish } from 'lib/utils';

import styles from 'public/styles/page/paymentWidget.module.scss';
import visaLogo from 'assets/images/logos/visa.svg';
import amexLogo from 'assets/images/logos/amex.svg';
import mastercardLogo from 'assets/images/logos/mastercard.svg';
import discoverLogo from 'assets/images/logos/discover.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faBuildingColumns, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faCcStripe } from '@fortawesome/free-brands-svg-icons'

const PaymentForms = ({ orderId, acceptCard, acceptCheck, acceptStripe, acceptExternal, presetPaymentAmount, postFunc }) => {

	const [paymentAmount, setPaymentAmount] = useState(presetPaymentAmount || '');
	const [creditCard, setCreditCard] = useState({
		cardNumber: "",
		expiration: "",
		cardCode: "",
		brand: null
	});
	const [check, setCheck] = useState({
		image: null
	});
	const [stripeInvoice, setStripeInvoice] = useState({
		id: null
	});
	const [externalPayment, setExternalPayment] = useState({
		image: null
	});
	const [user, setUser] = useState(null);

	const cardSection = useRef(null);
	const checkSection = useRef(null);
	const stripeSection = useRef(null);
	const externalSection = useRef(null);
	const uploadCheckLink = useRef(null);
	const uploadExternalImageLink = useRef(null);

	const handleCreditCardUpdate = (event) => {
		const prop = event.currentTarget.name;
		let value = event.currentTarget.value;
		let newCard = { ...creditCard };

		if (prop === 'cardNumber') {
			// Update the brand information as well should the credit card number been changed
			switch (value[0]) {
				case '3':
					newCard.brand = 'amex';
					break;
				case '4':
					newCard.brand = 'visa';
					break;
				case '5':
					newCard.brand = 'mastercard';
					break;
				case '6':
					newCard.brand = 'discover';
					break;
				default:
					newCard.brand = null;
			}

			// Also reformat the credit card number so that it displays nicely on screen
			value = value.split(' ').join('');
			if (newCard.brand === 'amex') {
				value = (value.slice(0, 4) + ' ' + value.slice(4, 10) + ' ' + value.slice(10, 15)).trim();
			} else {
				value = (value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12) + ' ' + value.slice(12, 16)).trim();
			}
		} else if (prop === 'expiration') {
			// Format the expiration date so that a slash appears between the month and the year
			value = value.split('/').join('');
			if (value.length >= 3) {
				value = (value.slice(0, 2) + '/' + value.slice(2, 4));
			}
		}

		newCard[prop] = value;
		setCreditCard(newCard);
	};

	const uploadCheckImage = async (event) => {
		let checkBlob = await uploadFile(event);
		let newCheck = {
			...check,
			image: checkBlob
		};

		setCheck(newCheck);
	};

	const handleStripeUpdate = (event) => {
		let newStripeInvoice = {
			...stripeInvoice,
			[event.currentTarget.name]: event.currentTarget.value
		};

		setStripeInvoice(newStripeInvoice);
	};

	const uploadExternalPaymentImage = async (event) => {
		let externalBlob = await uploadFile(event);
		let newPayment = {
			...externalPayment,
			image: externalBlob
		};

		setExternalPayment(newPayment);
	}

	// Use this function to test whether characters are being validly typed the credit card inputs
	const testNumber = (event, limit, inputValue) => {
		const prop = event.currentTarget.name;

		// First, verify that the character that was pressed is indeed a number
		if (validateNumberOnly(event.data) === false) {
			event.preventDefault();
		}

		// Test whether more numbers are needed in any of the credit card input fields
		if (prop === 'cardNumber') {
			if (inputValue.split(' ').join('').length >= limit) {
				event.preventDefault();
			}
		} else {
			if (inputValue.split('/').join('').length >= limit) {
				event.preventDefault();
			}
		}
	};

	const placeCursorAtEnd = (event) => {
		const inputField = event.currentTarget;

		inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
		inputField.focus();
	};

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (imageToDisplay) => {
		publish('open-viewer', { currentIndex: 0, photos: [imageToDisplay] });
	};

	const uploadFile = async (event) => {
		// Dismiss any lingering toasts
		toast.dismiss();

		const filesToUpload = event.currentTarget.files;

		try {
			let newBlob = await upload(filesToUpload[0].name, filesToUpload[0], {
				access: 'public',
				handleUploadUrl: PAYMENTS_API.UPLOAD_IMAGE,
				clientPayload: { orderId : orderId },
				multipart: filesToUpload[0].size >= 5000000 // Break apart any files greater than 5 MBs in size  
			});

			// @TODO - Use toast to notify the user about the status of the upload

			// Update the blob to include metadata specific to our application
			// Please note that in production, the blob's metadata has been automatically updated and stored in the
			// database while we were uploading the file
			newBlob.orderId = orderId;
			newBlob.uploader = user.username;

			return newBlob;
		} catch (err) {
			console.error(err);
		}
	}

	const showSection = (refElement) => {
		if (cardSection.current) { cardSection.current.style.height = '0px'; }
		if (checkSection.current) { checkSection.current.style.height = '0px'; }
		if (stripeSection.current) { stripeSection.current.style.height = '0px'; }
		if (externalSection.current) { externalSection.current.style.height = '0px'; }

		refElement.current.style.height = refElement.current.scrollHeight + 'px';
	};

	const submitPayment = () => {
		// @TODO - Insert code here to send/authorize the payment data to Stripe 

		if (postFunc) {
			postFunc();
		}
	};

	useEffect(() => {
		setUser(getUserSession());

		if (cardSection.current) {
			showSection(cardSection);
		} else if (checkSection.current) {
			showSection(checkSection);
		} else if (stripeSection.current) {
			showSection(stripeSection);
		} else {
			showSection(externalSection);
		}
	}, []);

	return (
		<>
			<div className={ styles.paymentAccordion }>

				<div className={ styles.paymentAmountSection }>
					{ presetPaymentAmount ? '$' + (
						<div className={ styles.paymentAmountValue }>
							Amount to Pay: ${ presetPaymentAmount }
						</div>
					) : (
						<>
							<label htmlFor='paymentAmount'>Payment Amount ($)</label>
							<input
								type='text'
								id='paymentAmount'
								className={ styles.paymentAmountField }
								onChange={ (event) => setPaymentAmount(event.currentTarget.value) }
								value={ paymentAmount }
							/>
						</>
					) }
				</div>

				{ /* CREDIT CARD SECTION */ }
				{ acceptCard ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(cardSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Credit Card</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faCreditCard }/>
						</div>
						<div className={ styles.paymentAccordionSectionBody } ref={ cardSection }>
							<div>
								<input
									name='cardNumber'
									type='tel'
									className={ styles.paymentCcNumberInput }
									tabIndex='-1'
									placeholder='Enter your 15 or 16-digit card number here...'
									value={ creditCard.cardNumber }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testNumber(event, (creditCard.brand === 'amex' ? 15 : 16), creditCard.cardNumber) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
								/>
							</div>
							<div>
								<label htmlFor='creditCardExp' className={ styles.paymentAmountLabel }>Exp Date</label>
								<input
									id='creditCardExp'
									name='expiration'
									type='tel'
									className={ styles.paymentSmallInput }
									tabIndex='-1'
									placeholder='MM/YY'
									value={ creditCard.expiration }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testNumber(event, 4, creditCard.expiration) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
								/>
								<label htmlFor='creditCardCode' className={ styles.paymentAmountLabel }>CSC</label>
								<input
									id='creditCardCode'
									name='cardCode'
									type='tel'
									className={ styles.paymentSmallInput }
									tabIndex='-1'
									placeholder={ (creditCard.brand === 'amex' ? '####' : '###') }
									value={ creditCard.cardCode }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testNumber(event, (creditCard.brand === 'amex' ? 4 : 3), creditCard.cardCode) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
								/>
								<span className={ styles.paymentCcIcons }>
									<Image
										src={ visaLogo }
										className={ creditCard.brand === 'visa' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Visa"
									/>
									<Image
										src={ amexLogo }
										className={ creditCard.brand === 'amex' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Amex"
									/>
									<Image
										src={ mastercardLogo }
										className={ creditCard.brand === 'mastercard' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="MasterCard"
									/>
									<Image
										src={ discoverLogo }
										className={ creditCard.brand === 'discover' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Discover"
									/>
								</span>
							</div>
						</div>
					</div>
				) : null }

				{ /* CHECK SECTION */ }
				{ acceptCheck ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(checkSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Check</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faBuildingColumns }/>
						</div>
						<div className={ styles.paymentAccordionSectionBody } ref={ checkSection }>
							{ check.image ? (
								<div className={ styles.paymentImageContainer }>
									<Image
										src={ check.image.url }
										width={ 100 }
										height={ 100 }
										alt={ check.image.pathname }
										onClick={ () => viewImage(check.image) }
									/>
								</div>
							) : null }
							<div>
								<button className={ styles.uploadImageButton } onClick={ () => uploadCheckLink.current.click() }>
									Upload Check
								</button>
								<input
									type='file'
									ref={ uploadCheckLink }
									className={ styles.uploadFileInput }
									accept='.pdf,.jpeg,.jpg,.mp4,.png'
									onChange={ uploadCheckImage }
								/>
							</div>
						</div>
					</div>
				) : null }

				{ /* STRIPE SECTION */ }
				{ acceptStripe ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(stripeSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Stripe</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faCcStripe }/>
						</div>
						<div className={ styles.paymentAccordionSectionBody } ref={ stripeSection }>
							<div>
								<select className={ styles.paymentSelect } name='id' onChange={ handleStripeUpdate }>
									<option value='' disabled>Please select from below...</option>
								</select>
							</div>
						</div>
					</div>
				) : null }

				{ /* EXTERNAL SECTION */ }
				{ acceptExternal ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(externalSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Check</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faDollarSign }/>
						</div>
						<div className={ styles.paymentAccordionSectionBody } ref={ externalSection }>
							{ externalPayment.image ? (
								<div className={ styles.paymentImageContainer }>
									<Image
										src={ externalPayment.image.url }
										width={ 100 }
										height={ 100 }
										alt={ externalPayment.image.pathname }
										onClick={ () => viewImage(externalPayment.image) }
									/>
								</div>
							) : null }
							<div>
								<button className={ styles.uploadImageButton }
												onClick={ () => uploadExternalImageLink.current.click() }>
									Upload Image
								</button>
								<input
									type='file'
									ref={ uploadExternalImageLink }
									className={ styles.uploadFileInput }
									accept='.pdf,.jpeg,.jpg,.mp4,.png'
									onChange={ uploadExternalPaymentImage }
								/>
							</div>
						</div>
					</div>
				) : null }

				<div className={ styles.submitRow }>
					<button className={ styles.submitButton } type='button' onClick={ submitPayment }>Make Payment</button>
				</div>
			</div>
		</>
	);
}

export default PaymentForms;