'use client'

import React, { useState, useEffect } from "react";

import styles from 'public/styles/page/orderDetails.module.scss';

import { validateDesignProp } from 'app/admin/orderDetails/designValidation';

const DesignField = ({ data, order, propName, dispatch }) => {

	const [selectedOption, setSelectedOption] = useState(order.design[propName]);
	const [description, setDescription] = useState(order.designDescription[propName]);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		setDisabled(validateDesignProp(order.design, propName) === false);
		setSelectedOption(order.design[propName]);
		setDescription(order.designDescription[propName]);
	}, [order.design, order.designDescription, propName]);

	const handleDesignUpdate = (event) => {
		const selection = event.currentTarget.value;
		let newDesc = '';

		// Update the design description in accordance with whatever option was selected
		for (let i = 0; i < data.options.length; i += 1) {
			if (selection === data.options[i].id) {
				newDesc = data.options[i].description || '';
				break;
			}
		}

		setSelectedOption(selection);
		setDescription(newDesc);
		dispatch({
			type: 'designChanged',
			propName: propName,
			design: selection,
			designDesc: newDesc
		});
	};

	const handleDescUpdate = (event) => {
		const newDesc = event.currentTarget.value;

		setDescription(newDesc);
		dispatch({
			type: 'designDescriptionChanged',
			propName: propName,
			designDesc: newDesc
		})
	};

	return (
		<>
			<span className={ styles.inputGroup }>
				<label className={ styles.orderFormLabel }>{ data.technicalLabel }</label>
				<span className={ styles.designInputGroup }>
					<select
						className={ styles.inputControl }
						onChange={ handleDesignUpdate }
						value={ selectedOption }
						disabled={ disabled }
					>
						<option value='' disabled>Select...</option>
						{ data.options.map((each, index) => {
							return (
								<option key={ index } value={ each.id }>{ each.label }</option>
							)
						})}
					</select>
					<textarea
						value={ description }
						onChange={ handleDescUpdate }
						className={ styles.mediumInputControl }
						disabled={ disabled }
					></textarea>
				</span>
			</span>
		</>
	);
}

export default DesignField;