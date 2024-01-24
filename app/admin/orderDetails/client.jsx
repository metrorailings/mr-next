'use client'

import React, { useReducer } from "react";

import { } from '@fortawesome/free-solid-svg-icons'
import styles from 'public/styles/page/orderDetails.module.scss';

import Multitext from 'components/multitext'; 
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
			glassBuild: order.design?.glassBuild || ''
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
			glassBuild: order.designDescription?.glassBuild || ''
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

	// console.log('ORDER DETAILS');
	// console.log(orderDetails);

	return (
		<>
			<div id={styles.page_container}>
				<h3 className={styles.page_header}>CLIENT ORDER</h3>
				{ order._id ? (
					<div id={styles.order_id_box}>
						<div>ID</div>
						<div>{ order._id }</div>
					</div>
				) : null }
				<hr className={styles.page_divider}></hr>

				{/* ---------- CUSTOMER SECTION ---------- */}

				<div className={styles.order_form_section}>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>Customer Name</label>
						<input 
							type='text'
							name='customer.name'
							className={styles.medium_input_control}
							onChange={ handleOrderUpdate }
						/>
					</span>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>Company</label>
						<input
							type='text'
							name='customer.company'
							className={styles.medium_input_control}
							onChange={ handleOrderUpdate }
						/>
					</span>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>E-mail Addresses</label>
						<Multitext
							values={ orderDetails.customer?.email ? orderDetails.customer.email.split(',') : [] }
							removeValue={removeEmail}
							addNewValue={addNewEmail}
							placeholder={ 'Separate e-mail addresses with a comma' }
						/>
					</span>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>Phone Number</label>
						<span className={styles.input_sub_group}>
							<input
								type='text'
								name='customer.areaCode'
								placeholder='Area Code'
								className={styles.small_input_control}
								onChange={ handleOrderUpdate }
							/>
							<input
								type='text'
								name='customer.phoneOne'
								placeholder='###'
								className={styles.small_input_control}
								onChange={ handleOrderUpdate }
							/>
							<input
								type='text'
								name='customer.phoneTwo'
								placeholder='####'
								className={styles.small_input_control}
								onChange={ handleOrderUpdate }
							/>
						</span>
					</span>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- ADDRESS SECTION ---------- */}

				<div className={styles.order_form_section}>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>Street Address</label>
						<input
							type='text'
							name='customer.address'
							className={styles.medium_input_control}
							onChange={ handleOrderUpdate }
						/>
					</span>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>City</label>
						<input
							type='text'
							name='customer.city'
							className={styles.medium_input_control}
							onChange={ handleOrderUpdate }
						/>
					</span>
					<span className={styles.medium_input_group}>
						<label className={styles.label}>State</label>
						<select
							name='customer.state'
							className={styles.medium_input_control}
							onChange={ handleOrderUpdate }
						>
							<option value='' disabled>Select a state...</option>
							<option value='NJ'>New Jersey</option>
							<option value='NY'>New York</option>
							<option value='PA'>Pennsylvania</option>
							<option value='other'>Other</option>
						</select>
					</span>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- DESIGN TYPE SECTION ---------- */}

				<div className={styles.order_form_section}>
					<DesignField
						data={ types }
						order={ orderDetails }
						propName={ 'type' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- BASE DESIGN SECTION ---------- */}

				<div className={styles.order_form_section}>
					<DesignField
						data={ posts }
						order={ orderDetails }
						propName={ 'post' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ handrailings }
						order={ orderDetails }
						propName={ 'handrailing' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ postEnds }
						order={ orderDetails }
						propName={ 'postEnd' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ postCaps }
						order={ orderDetails }
						propName={ 'postCap' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ ada }
						order={ orderDetails }
						propName={ 'ada' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ colors }
						order={ orderDetails }
						propName={ 'color' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- PICKET SECTION ---------- */}

				<div className={styles.order_form_section}>
					<DesignField
						data={ picketSizes }
						order={ orderDetails }
						propName={ 'picketSize' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ picketStyles }
						order={ orderDetails }
						propName={ 'picketStyle' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- TRADITIONAL OPTIONS SECTION ---------- */}

				<div className={styles.order_form_section}>
					<DesignField
						data={ centerDesigns }
						order={ orderDetails }
						propName={ 'centerDesign' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ collars }
						order={ orderDetails }
						propName={ 'collars' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ baskets }
						order={ orderDetails }
						propName={ 'baskets' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ valences }
						order={ orderDetails }
						propName={ 'valence' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- CABLE OPTIONS SECTION ---------- */}

				<div className={styles.order_form_section}>
					<DesignField
						data={ cableSizes }
						order={ orderDetails }
						propName={ 'cableSize' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

				<hr className={styles.section_divider}></hr>

				{/* ---------- GLASS OPTIONS SECTION ---------- */}
				<div className={styles.order_form_section}>
					<DesignField
						data={ glassTypes }
						order={ orderDetails }
						propName={ 'glassType' }
						dispatch={ orderDispatch }
					></DesignField>
					<DesignField
						data={ glassCharacteristics }
						order={ orderDetails }
						propName={ 'glassBuild' }
						dispatch={ orderDispatch }
					></DesignField>
				</div>

			</div>
		</>
	);
};

export default OrderDetailsPage;