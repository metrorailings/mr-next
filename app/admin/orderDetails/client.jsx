'use client'

import React, { useReducer } from "react";

import styles from 'public/styles/page/orderDetails.module.scss';

import Multitext from 'components/multitext'; 
import PaymentForms from 'components/paymentForms';
import Notes from 'components/admin/notes';
import DesignField from 'app/admin/orderDetails/DesignField';
import orderReducer from 'app/admin/orderDetails/orderReducer';

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

const OrderDetailsPage = ({ jsonOrder }) => {

	const order = JSON.parse(jsonOrder);

console.log(order);
	const [orderDetails, orderDispatch] = useReducer(orderReducer, {
		_id: order._id || 0,
		version: order.version || 1,

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
			pricePerFoot: order.pricing?.pricePerFoot,
			additionalPrice: order.pricing?.additionalPrice,
			isTaxApplied: !!(order.pricing?.isTaxApplied),
			isTariffApplied: false,
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
		pictures: order.pictures || []
	});

	const handleOrderUpdate = (event) => {
		orderDispatch({
			type: 'genericOrderUpdate',
			properties: event.currentTarget.name.split('.'),
			value: event.currentTarget.value
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
					<span className={ styles.mediumInputGroup }>
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
					<span className={ styles.mediumInputGroup }>
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
					<span className={ styles.mediumInputGroup }>
						<label htmlFor='customer.email' className={ styles.orderFormLabel }>E-mail Addresses</label>
						<Multitext
							values={ orderDetails.customer?.email ? orderDetails.customer.email.split(',') : [] }
							removeValue={ removeEmail }
							addNewValue={ addNewEmail }
							placeholder={ 'Separate e-mail addresses with a comma' }
							id='customer.email'
						/>
					</span>
					<span className={ styles.mediumInputGroup }>
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
					<span className={ styles.mediumInputGroup }>
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
					<span className={ styles.mediumInputGroup }>
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
					<span className={ styles.mediumInputGroup }>
						<label htmlFor='customer.state' className={ styles.orderFormLabel }>State</label>
						<select
							name='customer.state'
							id='customer.state'
							className={ styles.mediumInputControl }
							onChange={ handleOrderUpdate }
							value={ orderDetails.customer.state }
						>
							<option value='' disabled>Select a state...</option>
							<option value='NJ'>New Jersey</option>
							<option value='NY'>New York</option>
							<option value='PA'>Pennsylvania</option>
							<option value='other'>Other</option>
						</select>
					</span>
				</div>

				<hr className={ styles.sectionDivider }></hr>

				{/* ---------- NOTES SECTION ---------- */ }

				{ orderDetails._id ? (
					<div className={ styles.orderFormSection }>
						<Notes
							orderId={ orderDetails._id }
							existingNotes={ orderDetails.notes || [] }
							lazyLoad={ false }
							inSpanish={ false }
							users={ [] }
						/>
					</div>
				) : null }

				<hr className={ styles.sectionDivider }></hr>

				{/* ---------- DESIGN TYPE SECTION ---------- */ }

				<div className={ styles.orderFormSection }>
					<DesignField
						data={ types }
						order={ orderDetails }
						propName={ 'type' }
						dispatch={ orderDispatch }
					/>
				</div>

				<hr className={ styles.sectionDivider }></hr>

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

				<div className={ styles.orderPaymentSection }>
					<PaymentForms
						orderId={ orderDetails._id }
						acceptCard={ true }
						acceptAlternate={ true }
						cards={ orderDetails.payments?.cards }
						balanceRemaining={ orderDetails.payments?.balanceRemaining }
						postFunc={ () => {
							console.log('In post func');
						} }
					/>
				</div>
			</div>
		</>
	)
};

export default OrderDetailsPage;