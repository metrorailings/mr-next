import React, { useState } from 'react';

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Multitext = ({ values, placeholder, removeValue, addNewValue, id }) => {

	const [textValue, setTextValue] = useState('');

	const recordValue = () => {

		// Check if the value is not empty
		if (textValue.trim() === '') {
			return false;
		}

		// Check to see if the value is already present in the multitext field.
		// If so, do not record the value
		for (let i = 0; i < values.length; i += 1) {
			if (textValue === values[i]) {
				return false;
			}
		}

		// If all checks pass, invoke the function responsible for adding the new value into whatever data model it
		// belongs in
		addNewValue(textValue);
		setTextValue('');
	};

	const detectComma = (event) => {
		const newTextValue = event.currentTarget.value;

		// Remember that new values are only stored once the comma button is pressed
		if (newTextValue.charAt(newTextValue.length - 1) === ',') {
			recordValue(event);
			return false;
		}

		setTextValue(newTextValue.trim());
		return true;
	};

	return (
		<>
			<div className={ styles.multitextContainer }>
				<div className={ styles.multitextExistingValues }>
					{ values.map((each, index) => {
						return (
							<span className={ styles.multitextSetValue } data-value={ each } key={ index }>
								{ each }
								<FontAwesomeIcon icon={ faTimes } className={ styles.multitextRemoveMark } onClick={() => removeValue(each) } />
							</span>
						)
					})}
				</div>
				<textarea
					className={ styles.multitextNewValue }
					placeholder={ placeholder || 'Separate entries here with a comma' }
					onChange={ detectComma }
					onBlurCapture={ recordValue }
					value={ textValue }
					id={ id }
				></textarea>
			</div>
		</>
	);
};

export default Multitext;