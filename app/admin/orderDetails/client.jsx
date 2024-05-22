'use client'

// @TODO - Beautify this component on mobile
// @TODO - Split the code out into multiple files wherever possible

import React, { useState, useReducer, useEffect } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import _ from 'lodash';

import { saveOrder, generateInvoice } from 'actions/order';

import Multitext from 'components/multitext';
import MultiSelect from 'components/multiSelect';
import OptionSet from 'components/admin/optionSet';
import PaymentForms from 'components/paymentForms';
import Notes from 'components/admin/notes';
import FileUpload from 'components/admin/fileUpload';
import { toastValidationError } from 'components/customToaster';
import MRToolTip from 'components/tooltip';

import DesignField from 'app/admin/orderDetails/DesignField';
import orderReducer from 'app/admin/orderDetails/orderReducer';
import { OrdersContext, OrdersDispatchContext } from 'app/admin/orderDetails/orderContext';
import SalesAssigneeActions from 'app/admin/orderDetails/SalesAssigneeActions';
import InvoiceAmountModal from 'app/admin/orderDetails/InvoiceAmountModal';

import { validateEmpty, validateNumberOnly, runValidators, validateEmail } from 'lib/validators/inputValidators';
import { serverActionCall } from 'lib/http/clientHttpRequester';
import { buildUserMap } from 'lib/userInfo';
import { publish, calculateOrderTotal, formatUSDAmount } from 'lib/utils';

import types from 'lib/designs/types';
import posts from 'lib/designs/posts';
import handrailings from 'lib/designs/handrailings';
import postCaps from 'lib/designs/postCaps';
import postEnds from 'lib/designs/postEnds';
import ada from 'lib/designs/ada';
import colors from 'lib/designs/colors';
import picketSizes from 'lib/designs/picketSizes';
import picketStyles from 'lib/designs/picketStyles';
import centerDesigns from 'lib/designs/centerDesigns';
import baskets from 'lib/designs/baskets';
import collars from 'lib/designs/collars';
import valences from 'lib/designs/valences';
import cableSizes from 'lib/designs/cableSizes';
import glassTypes from 'lib/designs/glassTypes';
import glassCharacteristics from 'lib/designs/glassCharacteristics';

import visaLogo from 'assets/images/logos/visa.svg';
import amexLogo from 'assets/images/logos/amex.svg';
import mastercardLogo from 'assets/images/logos/mastercard.svg';
import discoverLogo from 'assets/images/logos/discover.svg';
import styles from 'public/styles/page/orderDetails.module.scss';

const OrderDetailsPage = ({ jsonOrder }) => {

	const order = JSON.parse(jsonOrder);
	
	const [isDirty, setIsDirty] = useState(false);
	const [userMap, setUserMap] = useState({});
	const [orderDetails, orderDispatch] = useReducer(orderReducer, {
		_id: order._id || 0,
		version: order.version || 1,

		sales: {
			header: order.sales?.header || '',
			assignees: order.sales?.assignees || [],
			invoiceSeq: order.sales?.quoteSeq || 0,
			invoices: order.sales?.invoices || []
		},

		customer: {
			name: order.customer?.name || '',
			company: order.customer?.company || '',
			email: order.customer?.email || [],
			areaCode: order.customer?.areaCode || '',
			phoneOne: order.customer?.phoneOne || '',
			phoneTwo: order.customer?.phoneTwo || '',
			address: order.customer?.address || '',
			aptSuiteNo: order.customer?.aptSuiteNo || '',
			city: order.customer?.city || '',
			state: order.customer?.state || '',
			zipCode: order.customer?.zipCode || ''
		},

		design: {
			type: order.design?.type || '',
			post: order.design?.postSize || '',
			handrailing: order.design?.handrailing || '',
			postEnd: order.design?.postEnd || '',
			postCap: order.design?.postCap || '',
			ada: order.design?.ada || '',
			picketSize: order.design?.picketSize || '',
			picketStyle: order.design?.picketStyle || '',
			centerDesign: order.design?.centerDesign || '',
			collars: order.design?.collars || '',
			baskets: order.design?.baskets || '',
			valence: order.design?.valence || '',
			cableSize: order.design?.cableSize || '',
			glassType: order.design?.glassType || '',
			glassBuild: order.design?.glassBuild || '',
			color: order.design?.color || ''
		},

		designDescription: {
			type: order.designDescription?.type || '',
			post: order.designDescription?.postSize || '',
			handrailing: order.designDescription?.handrailing || '',
			postEnd: order.designDescription?.postEnd || '',
			postCap: order.designDescription?.postCap || '',
			ada: order.designDescription?.ada || '',
			picketSize: order.designDescription?.picketSize || '',
			picketStyle: order.designDescription?.picketStyle || '',
			centerDesign: order.designDescription?.centerDesign || '',
			collars: order.designDescription?.collars || '',
			baskets: order.designDescription?.baskets || '',
			valence: order.designDescription?.valence || '',
			cableSize: order.designDescription?.cableSize || '',
			glassType: order.designDescription?.glassType || '',
			glassBuild: order.designDescription?.glassBuild || '',
			color: order.design?.color || ''
		},

		dimensions: {
			length: order.dimensions?.length || 0,
			finishedHeight: order.dimensions?.finishedHeight || 0
		},

		pricing: {
			pricePerFoot: order.pricing?.pricePerFoot || 0,
			additionalPrice: order.pricing?.additionalPrice || 0,
			isTaxApplied: order.pricing?.isTaxApplied || false,
			tax: order.pricing?.tax || 0,
			isFeeApplied: order.pricing?.isFeeApplied || false,
			fee: order.pricing?.fee || 0,
			subtotal: order.pricing?.subtotal || 0,
			orderTotal: order.pricing?.orderTotal || 0,
			depositAmount: order.pricing?.depositAmount || 0,
			shopBonus: order.pricing?.shopBonus || 0
		},

		status: order.status || '',

		text: {
			additionalDescription: order.text?.additionalDescription || '',
			agreement: order.text?.agreement || []
		},

		payments: {
			balanceRemaining: order.payments?.balanceRemaining || 0,
			cards: order.payments?.cards || [],
			charges: order.payments?.charges || []
		},

		modHistory: order.modHistory || [],
		dates: order.dates || {},
		notes: order.notes || [],
		files: order.files || []
	});
	const [cleanOrderDetails, setCleanOrderDetails] = useState(structuredClone(orderDetails));

	const approvedInvoices = orderDetails.sales.invoices.reduce((accumulator, invoice) => accumulator + (invoice.status === 'finalized' ? 1 : 0), 0);
	const assignedUsers = orderDetails.sales.assignees.map((assignee) => assignee.username);

	const handleOrderUpdate = (event) => {
		orderDispatch({
			type: 'genericOrderUpdate',
			properties: event.currentTarget.name.split('.'),
			value: event.currentTarget.value
		});
	};

	const handleOrderUpdateNum = (event) => {
		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: event.currentTarget.name.split('.'),
			value: event.currentTarget.value
		});
	};

	const handleOptionSetUpdate = (prop, value) => {
		orderDispatch({
			type: 'genericOrderUpdate',
			properties: prop.split('.'),
			value: value
		});
	};

	const handleEmailUpdate = (newEmails) => {
		orderDispatch({
			type: 'updateEmail',
			value: newEmails
		});
	};

	const addSalesAssignee = (assigneeUsername) => {
		orderDispatch({
			type: 'addNewSalesAssignee',
			value: assigneeUsername
		});
	};

	const calculateSubtotal = () => {
		let runningTotal = 0;

		if (orderDetails.dimensions.length && orderDetails.pricing.pricePerFoot) {
			runningTotal += orderDetails.dimensions.length * orderDetails.pricing.pricePerFoot;
		}
		runningTotal += orderDetails.pricing.additionalPrice || 0;

		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: ['pricing', 'subtotal'],
			value: runningTotal
		});
	}

	const calculateTotalsTaxesAndFees = () => {

		const { tax, fee, totalPrice } = calculateOrderTotal(orderDetails.pricing.subtotal, orderDetails.pricing.isTaxApplied, orderDetails.pricing.isFeeApplied, orderDetails.customer.state);

		// Finally, update the tax, fee, and order total within our order modal, but only if the values are different from what's currently stored
		// We want to minimize the number of hard updates made to the orderDetails object as that in turn would trigger additional logic that would slow down processing on the page
		if (orderDetails.pricing.tax !== tax) {
			orderDispatch({
				type: 'genericOrderUpdateNum',
				properties: ['pricing', 'tax'],
				value: tax
			});
		}
		if (orderDetails.pricing.fee !== fee) {
			orderDispatch({
				type: 'genericOrderUpdateNum',
				properties: ['pricing', 'fee'],
				value: fee
			});
		}
		if (orderDetails.pricing.orderTotal !== totalPrice) {
			orderDispatch({
				type: 'genericOrderUpdateNum',
				properties: ['pricing', 'orderTotal'],
				value: totalPrice
			});
		}
	}

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

	// ------- -Validation Logic
	const testAreaCode = () => orderDetails.customer.areaCode.length === 3 && validateNumberOnly(orderDetails.customer.areaCode);
	const testPhoneOne = () => orderDetails.customer.phoneOne.length === 3 && validateNumberOnly(orderDetails.customer.phoneOne);
	const testPhoneTwo = () => orderDetails.customer.phoneTwo.length === 4 && validateNumberOnly(orderDetails.customer.phoneTwo);
	const testPhoneNumber = () => testAreaCode() && testPhoneOne() && testPhoneTwo();
	const testEmail = (value) => validateEmail(value);
	const testNonZero = (value) => value > 0;

	const testContactInfoProvided = () => {
		return ((orderDetails.customer.email.length) || testPhoneNumber());
	}

	const saveValidationFields = [
		{ prop: orderDetails.customer.name, validator: validateEmpty, errorMsg: 'The customer\'s name is needed before anything about this order can be saved.'},
		{ prop: orderDetails.customer, validator: testContactInfoProvided, errorMsg: 'Put in a valid phone number or at least one e-mail address for this order.' },
	];
	const invoiceValidationFields = [
		{ prop: orderDetails.design.type, validator: validateEmpty, errorMsg: 'A product type has to be specified here before a quote/invoice is electronically sent out.' },
		{ prop: orderDetails.sales.header, validator: validateEmpty, errorMsg: 'The order header cannot be empty, as it would differentiate this order from other orders made for the same customer.' },
		{ prop: orderDetails.text.additionalDescription, validator: validateEmpty, errorMsg: 'A description of the order needs to be provided, even if it\'s only one basic line.' },
		{ prop: orderDetails.payments.balanceRemaining, validator: testNonZero, errorMsg: (approvedInvoices ? 'No outstanding balance remains on this order.' : 'The order has to be priced first before a quote can be issued.') },
		{ prop: orderDetails.sales.assignees, validator: validateEmpty, errorMsg: 'At least one salesman should be assigned to this order before any quotes or invoices are sent out.' },
		{ prop: orderDetails.customer.state, validator: validateEmpty, errorMsg: 'The city and state need to be specified.' }
	];

	const issueInvoice = async () => {
		const invoice = await serverActionCall(generateInvoice, orderDetails, {
			loading: 'Drafting a new quote...',
			success: 'A new quote has been drafted and sent out!',
			error: 'Something went wrong when trying to generate a new quote. Please try again. If it doesn\'t work, consult Rickin.'
		});

		if (invoice.success) {
			// Add new invoice to the order here
		}
	};

	const saveAllProps = async () => {
		const errors = runValidators(saveValidationFields);

		if (errors.length === 0) {
			let processedOrder = await serverActionCall(saveOrder, orderDetails, {
				loading: 'Saving data...',
				success: 'All updates here have been saved!',
				error: 'Something went wrong when trying to save details. Please try again. If it doesn\'t work, consult Rickin.'
			});

			if (processedOrder.success) {
				processedOrder = JSON.parse(processedOrder.order);

				setCleanOrderDetails(structuredClone({
					...orderDetails,
					...processedOrder
				}));
				orderDispatch({
					type: 'overwriteOrder',
					value: processedOrder
				});
			}
		} else {
			toastValidationError(errors);
		}
	};

	const openInvoiceAmountModal = () => {
		const errors = [...(runValidators(saveValidationFields)), ...(runValidators(invoiceValidationFields))];

		if (errors.length === 0) {
			publish('open-content-modal', { ContextJSX: () => InvoiceAmountModal, contentData: orderDetails, confirmFunction: issueInvoice });
		} else {
			toastValidationError(errors);
		}
	}

	const resetOrder = () => {
		orderDispatch({
			type: 'overwriteOrder',
			value: structuredClone(cleanOrderDetails)
		});
	}

	useEffect(() => {
		calculateTotalsTaxesAndFees();

		// Load all the users if it hasn't been done yet
		const userLoader = async () => {
			if (Object.keys(userMap).length === 0) {
				const users = await buildUserMap();
				setUserMap(users);
			}
		}
		userLoader();

		// Find out if any part of the order has been modified
		setIsDirty(_.isEqual(cleanOrderDetails, orderDetails) === false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderDetails]);

	return (
		<>
			<OrdersContext.Provider value={ orderDetails }>
				<OrdersDispatchContext.Provider value={ orderDispatch }>
					<div className={ styles.pageContainer }>

						<h3 className={ styles.pageHeader }>CLIENT ORDER</h3>
						{ orderDetails._id ? (
							<div className={ styles.orderIdBox }>
								ID: { orderDetails._id }
							</div>
						) : null }
						<hr className={ styles.firstPageDivider }></hr>

						{/* ---------- CUSTOMER SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.name' className={ styles.orderFormLabel }>Customer Name</label>
								<input
									type='text'
									name='customer.name'
									id='customer.name'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.customer.name }
								/>
							</span>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.company' className={ styles.orderFormLabel }>Company</label>
								<input
									type='text'
									name='customer.company'
									id='customer.company'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.customer.company }
								/>
							</span>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.email' className={ styles.orderFormLabel }>E-mail Addresses</label>
								<Multitext
									values={ orderDetails.customer.email }
									updateFunc={ handleEmailUpdate }
									validator={ testEmail }
									validatorFailMessage={ 'The e-mail address you entered wasn\'t properly written.' }
									placeholder={ 'Separate e-mail addresses with a comma' }
								/>
							</span>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.areaCode' className={ styles.orderFormLabel }>Phone Number</label>
								<span className={ styles.inputSubGroup }>
									<input
										type='tel'
										name='customer.areaCode'
										id='customer.areaCode'
										placeholder='Area Code'
										maxLength={ 3 }
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										value={ orderDetails.customer.areaCode }
									/>
									<input
										type='tel'
										name='customer.phoneOne'
										id='customer.phoneOne'
										maxLength={ 3 }
										placeholder='###'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										value={ orderDetails.customer.phoneOne }
									/>
									<input
										type='tel'
										name='customer.phoneTwo'
										id='customer.phoneTwo'
										maxLength={ 4 }
										placeholder='####'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										value={ orderDetails.customer.phoneTwo }
									/>
								</span>
							</span>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- ADDRESS SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.address' className={ styles.orderFormLabel }>Street Address</label>
								<input
									type='text'
									name='customer.address'
									id='customer.address'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.customer.address }
								/>
							</span>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.city' className={ styles.orderFormLabel }>City</label>
								<input
									type='text'
									name='customer.city'
									id='customer.city'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.customer.city }
								/>
							</span>
							<span className={ styles.inputGroup }>
								<label htmlFor='customer.state' className={ styles.orderFormLabel }>State</label>
								<select
									name='customer.state'
									id='customer.state'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.customer.state }
								>
									<option value='' disabled>Pick a State</option>
									<option value="NJ">New Jersey</option>
									<option value="NY">New York</option>
									<option value="PA">Pennsylvania</option>
									<option value="AL">Alabama</option>
									<option value="AK">Alaska</option>
									<option value="AZ">Arizona</option>
									<option value="AR">Arkansas</option>
									<option value="CA">California</option>
									<option value="CO">Colorado</option>
									<option value="CT">Connecticut</option>
									<option value="DE">Delaware</option>
									<option value="DC">Washington DC</option>
									<option value="FL">Florida</option>
									<option value="GA">Georgia</option>
									<option value="HI">Hawaii</option>
									<option value="ID">Idaho</option>
									<option value="IL">Illinois</option>
									<option value="IN">Indiana</option>
									<option value="IA">Iowa</option>
									<option value="KS">Kansas</option>
									<option value="KY">Kentucky</option>
									<option value="LA">Louisiana</option>
									<option value="ME">Maine</option>
									<option value="MD">Maryland</option>
									<option value="MA">Massachusetts</option>
									<option value="MI">Michigan</option>
									<option value="MN">Minnesota</option>
									<option value="MS">Mississippi</option>
									<option value="MO">Missouri</option>
									<option value="MT">Montana</option>
									<option value="NE">Nebraska</option>
									<option value="NV">Nevada</option>
									<option value="NH">New Hampshire</option>
									<option value="NM">New Mexico</option>
									<option value="NC">North Carolina</option>
									<option value="ND">North Dakota</option>
									<option value="OH">Ohio</option>
									<option value="OK">Oklahoma</option>
									<option value="OR">Oregon</option>
									<option value="RI">Rhode Island</option>
									<option value="SC">South Carolina</option>
									<option value="SD">South Dakota</option>
									<option value="TN">Tennessee</option>
									<option value="TX">Texas</option>
									<option value="UT">Utah</option>
									<option value="VT">Vermont</option>
									<option value="VA">Virginia</option>
									<option value="WA">Washington</option>
									<option value="WV">West Virginia</option>
									<option value="WI">Wisconsin</option>
									<option value="WY">Wyoming</option>
								</select>
							</span>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- NOTES SECTION ---------- */ }

						{ orderDetails._id ? (
							<>
								<div className={ styles.orderFormSection }>
									<Notes
										orderId={ orderDetails._id }
										existingNotes={ orderDetails.notes || [] }
										lazyLoad={ false }
										inSpanish={ false }
									/>
								</div>

								<hr className={ styles.sectionDivider }></hr>
							</>
						) : null }

						{/* ---------- FILE SECTION ---------- */ }

						{ orderDetails._id ? (
							<>
								<div className={ styles.orderFormSection }>
									<FileUpload
										orderId={ orderDetails._id }
										existingFiles={ orderDetails.files }
										lazyLoad={ false }
									/>
								</div>

								<hr className={ styles.sectionDivider }/>
							</>
						) : null }

						{/* ---------- DESIGN TYPE SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ types }
								order={ orderDetails }
								propName={ 'type' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }/>

						{/* ---------- DESCRIPTION/HEADER SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<span className={ styles.inputGroup }>
								<label htmlFor='sales.header' className={ styles.orderFormLabel }>Quote Header</label>
								<input
									type='text'
									name='sales.header'
									id='sales.header'
									className={ styles.mediumInputControl }
									onChange={ handleOrderUpdate }
									value={ orderDetails.sales.header }
								/>
							</span>

							<span className={ styles.wideInputGroup }>
								<label htmlFor='text.additionalDescription' className={ styles.orderFormLabel }>Order Description</label>
								<textarea
									type='text'
									name='text.additionalDescription'
									id='text.additionalDescription'
									className={ styles.descriptionTextarea }
									onChange={ handleOrderUpdate }
									value={ orderDetails.text.additionalDescription }
								/>
							</span>
						</div>

						<hr className={ styles.sectionDivider }/>

						{/* ---------- BASE DESIGN SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ posts }
								order={ orderDetails }
								propName={ 'post' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ handrailings }
								order={ orderDetails }
								propName={ 'handrailing' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ postEnds }
								order={ orderDetails }
								propName={ 'postEnd' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ postCaps }
								order={ orderDetails }
								propName={ 'postCap' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ ada }
								order={ orderDetails }
								propName={ 'ada' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ colors }
								order={ orderDetails }
								propName={ 'color' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- PICKET SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ picketSizes }
								order={ orderDetails }
								propName={ 'picketSize' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ picketStyles }
								order={ orderDetails }
								propName={ 'picketStyle' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- TRADITIONAL OPTIONS SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ centerDesigns }
								order={ orderDetails }
								propName={ 'centerDesign' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ collars }
								order={ orderDetails }
								propName={ 'collars' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ baskets }
								order={ orderDetails }
								propName={ 'baskets' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ valences }
								order={ orderDetails }
								propName={ 'valence' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- CABLE OPTIONS SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ cableSizes }
								order={ orderDetails }
								propName={ 'cableSize' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- GLASS OPTIONS SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<DesignField
								data={ glassTypes }
								order={ orderDetails }
								propName={ 'glassType' }
								dispatch={ orderDispatch }
							/>
							<DesignField
								data={ glassCharacteristics }
								order={ orderDetails }
								propName={ 'glassBuild' }
								dispatch={ orderDispatch }
							/>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- SALESMEN SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<span className={ styles.wideInputGroup }>
								<label htmlFor='sales.assignees' className={ styles.orderFormLabel }>
									Sales Representative(s)
									<span className={ styles.orderFormInputDirections }>Select up to 3 people</span>
								</label>
								<MultiSelect
									keyValueMap={ userMap }
									selectedValues={ assignedUsers }
									maxSelectionsAllowed={ 3 }
									updateFunc={ addSalesAssignee }
									placeholder={ 'Select a sales rep...' }
									ActionBar={ SalesAssigneeActions }
								/>
							</span>
						</div>

						<hr className={ styles.sectionDivider }></hr>

						{/* ---------- PRICING SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							<span className={ styles.inputGroup }>
								<label htmlFor='dimensions.length' className={ styles.orderFormLabel }>Length</label>
								<span className={ styles.orderDetailsInputRow }>
									<input
										type='tel'
										name='dimensions.length'
										id='dimensions.length'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										onBlur={ handleOrderUpdateNum }
										value={ orderDetails.dimensions.length }
									/>
									<span className={ styles.orderInputNeighboringText }>linear feet</span>
								</span>
							</span>

							<span className={ styles.inputGroup }>
								<label htmlFor='pricing.pricePerFoot' className={ styles.orderFormLabel }>Price Per Foot</label>
								<span className={ styles.orderDetailsInputRow }>
									<span className={ styles.orderInputNeighboringText }>$</span>
									<input
										type='tel'
										name='pricing.pricePerFoot'
										id='pricing.pricePerFoot'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										onBlur={ handleOrderUpdateNum }
										value={ orderDetails.pricing.pricePerFoot }
									/>
									<span className={ styles.orderInputNeighboringText }>per linear foot</span>
								</span>
							</span>

							<span className={ styles.inputGroup }>
								<label htmlFor='pricing.additionalPrice' className={ styles.orderFormLabel }>Additional Price</label>
								<span className={ styles.orderDetailsInputRow }>
									<span className={ styles.orderInputNeighboringText }>$</span>
									<input
										type='tel'
										name='pricing.additionalPrice'
										id='pricing.additionalPrice'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										onBlur={ handleOrderUpdateNum }
										value={ orderDetails.pricing.additionalPrice }
									/>
								</span>
							</span>

							<span className={ styles.inputGroup }>
								<label htmlFor='pricing.isTaxApplied' className={ styles.orderFormLabel }>Apply Tax?</label>
								<OptionSet
									labels={ ['Yes', 'No'] }
									values={ [true, false] }
									currentValue={ orderDetails.pricing.isTaxApplied }
									isDisabled={ orderDetails.customer.state !== 'NJ' }
									setter={ (value) => handleOptionSetUpdate('pricing.isTaxApplied', value) }
								/>
							</span>

							<span className={ styles.inputGroup }>
								<label htmlFor='pricing.isFeeApplied' className={ styles.orderFormLabel }>Apply CC Fee?</label>
								<OptionSet
									labels={ ['Yes', 'No'] }
									values={ [true, false] }
									currentValue={ orderDetails.pricing.isFeeApplied }
									isDisabled={ false }
									setter={ (value) => handleOptionSetUpdate('pricing.isFeeApplied', value) }
								/>
							</span>
						</div>

						<div className={ styles.orderFormSection }>
							<span className={ styles.inputGroup }>
								<label htmlFor='pricing.subtotal' className={ styles.orderFormLabel }>Order Subtotal</label>
								<span className={ styles.orderDetailsInputRow }>
									<span className={ styles.orderInputNeighboringText }>$</span>
									<input
										type='tel'
										name='pricing.subtotal'
										id='pricing.subtotal'
										className={ styles.smallInputControl }
										onChange={ handleOrderUpdate }
										onBlur={ handleOrderUpdateNum }
										value={ orderDetails.pricing.subtotal }
									/>
									<button className={ styles.orderDetailsSectionActionButton } onClick={ calculateSubtotal }>Auto-Calculate</button>
								</span>
							</span>
						</div>

						<div className={ styles.orderPricesSection }>
							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>Subtotal</label>
								<span className={ styles.priceText }>${ formatUSDAmount(orderDetails.pricing.subtotal) }</span>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>+</label>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>Taxes</label>
								<span className={ styles.priceText }>${ formatUSDAmount(orderDetails.pricing.tax) }</span>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>+</label>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>Fees</label>
								<span className={ styles.priceText }>${ formatUSDAmount(orderDetails.pricing.fee) }</span>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>=</label>
							</span>

							<span className={ styles.priceGroup }>
								<label className={ styles.priceLabel }>ORDER TOTAL</label>
								<span className={ styles.priceText }>${ formatUSDAmount(orderDetails.pricing.orderTotal) }</span>
							</span>
						</div>

						{/* ---------- PAYMENTS SECTION ---------- */ }

						<div className={ styles.orderFormSection }>
							{ orderDetails.payments.balanceRemaining > 0 ? (
								<div className={ styles.orderPaymentSection }>
									<PaymentForms
										orderId={ orderDetails._id }
										acceptCard={ true }
										acceptAlternate={ true }
										cards={ orderDetails.payments.cards }
										balanceRemaining={ orderDetails.payments.balanceRemaining || 0 }
										orderState={ orderDetails.customer.state || '' }
										postFunc={ () => {
											console.log('In post func');
										} }
									/>
								</div>
							) : null }

							{ orderDetails?.payments.charges.length ? (
								<span className={ styles.pastPaymentsSection }>
										<div className={ styles.pastPaymentsHeader }>Past Payments</div>
									{ orderDetails.payments.charges.map((payment) => {
										return (
											<div className={ styles.pastPaymentsRecord } key={ payment._id }>
												<div className={ styles.pastPaymentSignificantData }>{ payment.amount }</div>
												<div className={ styles.pastPaymentSignificantData }>
													{ payment.type === 'stripe' ? (
														<>
															<Image
																src={ determineCardBrandToShow(payment.stripeMetadata.card.brand) }
																width={ 64 }
																height={ 64 }
																alt={ payment.stripeMetadata.card.brand }
															/>
															<span>(...{ payment.stripeMetadata.card.last4 })</span>
														</>
													) : (
														<Image src={ payment.imageMetadata.url } width={ 160 } height={ 90 } alt='Image payment'/>
													) }
												</div>
												<div className={ styles.pastPaymentMinorData }>Processed On { dayjs(payment.date).format('MMM DD, YYYY') }</div>
											</div>
										);
									}) }
								</span>
							) : null }

							<hr className={ styles.sectionDivider }></hr>
						</div>

					</div>


					<div className={ styles.orderDetailsFooterPadding }/>

					<div className={ styles.orderDetailsActionFooter }>
						<button type='button' className={ styles.orderDetailsActionButton } onClick={ saveAllProps }>Save</button>
						{ orderDetails._id ? (
							<>
								<MRToolTip tooltipMessage='Please save or reset any changes you have made to the order prior to sending out a quote or invoice' turnOffTooltip={ !(isDirty) }>
									{ approvedInvoices === 0 ? (
										<button type='button' className={ styles.orderDetailsActionButton } onClick={ openInvoiceAmountModal } disabled={ isDirty }>Send a Quote</button>
										) : (
										<button type='button' className={ styles.orderDetailsActionButton } onClick={ openInvoiceAmountModal } disabled={ isDirty }>Send An Invoice</button>
									)}
								</MRToolTip>
								<button type='button' className={ styles.orderDetailsResetButton } onClick={ resetOrder } disabled={ !(isDirty) }>Reset</button>
							</>
						) : null }
					</div>

				</OrdersDispatchContext.Provider>
			</OrdersContext.Provider>
		</>
	);
};

export default OrderDetailsPage;