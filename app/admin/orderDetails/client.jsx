'use client'

import React, { useReducer, useEffect } from "react";

import { saveOrder, generateQuote } from 'actions/order';

import Multitext from 'components/multitext'; 
import OptionSet from 'components/admin/optionSet';
import PaymentForms from 'components/paymentForms';
import Notes from 'components/admin/notes';
import FileUpload from 'components/admin/fileUpload';
import { toastValidationError } from 'components/customToaster';

import DesignField from 'app/admin/orderDetails/DesignField';
import orderReducer from 'app/admin/orderDetails/orderReducer';

import { validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { serverActionCall } from 'lib/http/clientHttpRequester';

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

import styles from 'public/styles/page/orderDetails.module.scss';

const OrderDetailsPage = ({ jsonOrder, jsonUsers }) => {

	const order = JSON.parse(jsonOrder);
	const users = JSON.parse(jsonUsers);

	const [orderDetails, orderDispatch] = useReducer(orderReducer, {
		_id: order._id || 0,
		version: order.version || 1,

		sales: {
			header: order.sales?.header || '',
			assignees: order.sales?.assignee || [],
			quoteSeq: order.sales?.quoteSeq || 0
		},

		customer: {
			name: order.customer?.name || '',
			company: order.customer?.company || '',
			email: order.customer?.email || '',
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

		installation: {
			platformType: order.installation?.platformType || '',
			coverPlates: !!(order.installation?.coverPlates),
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

	const setOptionSetValue = (prop, value) => {
		orderDispatch({
			type: 'genericOrderUpdate',
			properties: prop.split('.'),
			value: value
		});
	};

	const addNewEmail = (newEmail) => {
		orderDispatch({
			type: 'addNewEmail',
			email: newEmail
		});
	};

	const removeEmail = (oldEmail) => {
		orderDispatch({
			type: 'removeEmail',
			email: oldEmail
		});
	};

	const calculateTotal = () => {
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
		const subtotal = orderDetails.pricing.subtotal || 0;
		let taxes = 0;
		let fees = 0;

		// Check to make sure taxes are explicitly charged and eligible to be charged in the first place before calculating the tax liability
		if (orderDetails.customer.state === 'NJ' && orderDetails.pricing.isTaxApplied) {
			taxes = Math.round(subtotal * 6.625) / 100;
		}	
		// Check to make sure fees can be explicitly charged before calculating the credit card surcharge
		if (orderDetails.pricing.isFeeApplied) {
			fees = Math.round(subtotal * 1.75) / 100;
		}

		// Finally, Update the tax, fee, and order total within our order modal
		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: ['pricing', 'tax'],
			value: taxes
		});
		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: ['pricing', 'fee'],
			value: fees
		});
		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: ['pricing', 'orderTotal'],
			value: subtotal + taxes + fees
		});
	}

	const calculateDeposit = () => {
		orderDispatch({
			type: 'genericOrderUpdateNum',
			properties: ['pricing', 'depositAmount'],
			value: Math.round(orderDetails.pricing.orderTotal * 50) / 100
		});
	}

	const testDescriptionProvidedIfMisc = () => {
		if ((orderDetails.design.type === 'T-MISC') && (validateEmpty(orderDetails.text.additionalDescription) === false)) {
			return false;
		}

		return true;
	}
	const quoteValidationFields = [
		{ prop: orderDetails.customer.name, validator: validateEmpty, errorMsg: 'A name is required for this prospect.'},
		{ prop: orderDetails.design.type, validator: validateEmpty, errorMsg: 'A product type has to be selected here.' },
		{ prop: orderDetails.sales.header, validator: validateEmpty, errorMsg: 'The quote header cannot be empty.' },
		{ prop: orderDetails.text.additionalDescription, validator: testDescriptionProvidedIfMisc, errorMsg: 'If a miscellaneous product type is specified, than a description has to be provided.' }
	];

	const submitForQuote = async () => {
		const errors = runValidators(quoteValidationFields);

		if (errors.length === 0) {
			const processedOrder = await serverActionCall(generateQuote, orderDetails, {
				loading: 'Drafting a new quote...',
				success: 'A new quote has been drafted and sent out!',
				error: 'Something went wrong when trying to generate a new quote. Please try again. If it doesn\'t work, consult Rickin.'
			});

			orderDispatch({
				type: 'overwriteOrder',
				value: processedOrder
			});
		} else {
			toastValidationError(errors);
		}
	};

	const saveOrder = () => {
	};

	useEffect(() => {
		calculateTotalsTaxesAndFees();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderDetails.pricing.subtotal, orderDetails.pricing.isTaxApplied, orderDetails.pricing.isFeeApplied, orderDetails.customer.state]);

	return (
		<>
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
							values={ orderDetails.customer?.email ? orderDetails.customer.email.split(',') : [] }
							removeValue={ removeEmail }
							addNewValue={ addNewEmail }
							placeholder={ 'Separate e-mail addresses with a comma' }
							id='customer.email'
						/>
					</span>
					<span className={ styles.inputGroup }>
						<label htmlFor='customer.areaCode' className={ styles.orderFormLabel }>Phone Number</label>
						<span className={ styles.inputSubGroup }>
							<input
								type='text'
								name='customer.areaCode'
								id='customer.areaCode'
								placeholder='Area Code'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdate }
								value={ orderDetails.customer.areaCode }
							/>
							<input
								type='text'
								name='customer.phoneOne'
								id='customer.phoneOne'
								placeholder='###'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdate }
								value={ orderDetails.customer.phoneOne }
							/>
							<input
								type='text'
								name='customer.phoneTwo'
								id='customer.phoneTwo'
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
								users={ users }
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

				{/* ---------- PAYMENTS SECTION ---------- */ }

				{ orderDetails?.status ? (
					<>
						<div className={ styles.orderPaymentSection }>
							<PaymentForms
								orderId={ orderDetails._id }
								acceptCard={ true }
								acceptAlternate={ true }
								cards={ orderDetails.payments?.cards }
								balanceRemaining={ orderDetails.payments?.balanceRemaining }
								orderState={ orderDetails.customer?.state || '' }
								postFunc={ () => {
									console.log('In post func');
								} }
							/>
						</div>

						<span className={ styles.test }>
							<span className={ styles.test }>
								<div className={ styles.test }>Amount</div>
								<div className={ styles.test }></div>
							</span>
						</span>

						<hr className={ styles.sectionDivider }></hr>
					</>
				) : null }

				{/* ---------- PRICING SECTION ---------- */ }
				<div className={ styles.orderFormSection }>
					<span className={ styles.inputGroup }>
						<label htmlFor='dimensions.length' className={ styles.orderFormLabel }>Length</label>
						<span className={ styles.orderDetailsInputRow }>
							<input
								type='text'
								name='dimensions.length'
								id='dimensions.length'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdateNum }
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
								type='text'
								name='pricing.pricePerFoot'
								id='pricing.pricePerFoot'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdateNum }
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
								type='text'
								name='pricing.additionalPrice'
								id='pricing.additionalPrice'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdateNum }
								value={ orderDetails.pricing.additionalPrice }
							/>
							<span className={ styles.orderInputNeighboringText }>per linear foot</span>
						</span>
					</span>

					<span className={ styles.inputGroup }>
						<label htmlFor='pricing.isTaxApplied' className={ styles.orderFormLabel }>Apply Tax?</label>
						<OptionSet
							labels={ ['Yes', 'No'] }
							values={ [true, false] }
							currentValue={ orderDetails.pricing.isTaxApplied }
							isDisabled={ orderDetails.customer.state !== 'NJ' }
							setter={ (value) => setOptionSetValue('pricing.isTaxApplied', value) }
						/>
					</span>

					<span className={ styles.inputGroup }>
						<label htmlFor='pricing.isFeeApplied' className={ styles.orderFormLabel }>Apply CC Fee?</label>
						<OptionSet
							labels={ ['Yes', 'No'] }
							values={ [true, false] }
							currentValue={ orderDetails.pricing.isFeeApplied }
							isDisabled={ false }
							setter={ (value) => setOptionSetValue('pricing.isFeeApplied', value) }
						/>
					</span>
				</div>

				<div className={ styles.orderFormSection }>
					<span className={ styles.inputGroup }>
						<label htmlFor='pricing.subtotal' className={ styles.orderFormLabel }>Order Subtotal</label>
						<span className={ styles.orderDetailsInputRow }>
							<span className={ styles.orderInputNeighboringText }>$</span>
							<input
								type='text'
								name='pricing.subtotal'
								id='pricing.subtotal'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdateNum }
								value={ orderDetails.pricing.subtotal }
							/>
							<button className={ styles.orderDetailsSectionActionButton } onClick={ calculateTotal }>Auto-Calculate</button>
						</span>
					</span>

					<span className={ styles.inputGroup }>
						<label htmlFor='pricing.depositAmount' className={ styles.orderFormLabel }>Deposit Amount</label>
						<span className={ styles.orderDetailsInputRow }>
							<span className={ styles.orderInputNeighboringText }>$</span>
							<input
								type='text'
								name='pricing.depositAmount'
								id='pricing.depositAmount'
								className={ styles.smallInputControl }
								onChange={ handleOrderUpdateNum }
								value={ orderDetails.pricing.depositAmount }
							/>
							<button className={ styles.orderDetailsSectionActionButton } onClick={ calculateDeposit }>Auto-Calculate</button>
						</span>
					</span>
				</div>

				<div className={ styles.orderPricesSection }>
					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>Subtotal</label>
						<span className={ styles.priceText }>${ orderDetails.pricing.subtotal.toFixed(2) }</span>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>+</label>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>Taxes</label>
						<span className={ styles.priceText }>${ orderDetails.pricing.tax.toFixed(2) }</span>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>+</label>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>Fees</label>
						<span className={ styles.priceText }>${ orderDetails.pricing.fee.toFixed(2) }</span>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>=</label>
					</span>

					<span className={ styles.priceGroup }>
						<label className={ styles.priceLabel }>ORDER TOTAL</label>
						<span className={ styles.priceText }>${ orderDetails.pricing.orderTotal.toFixed(2) }</span>
					</span>
				</div>

			</div>
		</>
	);
};

export default OrderDetailsPage;