import validator from 'validator';

/**
 * Function to validate strings to ensure they meet a a certain length while only containing alphanumeric characters and
 * other special characters that have been specifically declared as allowed 
 *
 * @param text - the text to test
 * @param allowedChars - the special characters that are allowed to be included in any valid string
 * @param minLength - the minimum length of any valid string
 * @param maxLength - the maximum length of any valid string
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateCredentials(text, allowedChars = '', minLength = 0, maxLength = 1000) {
	if (text.length < minLength || text.length > maxLength) {
		return false;
	}

	return validator.isAlphanumeric(text, 'en-US', { ignore: allowedChars });
}

/**
 * Function to validate a passed string contains only numbers and absolutely nothing else
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateNumberOnly(text) {
	return validator.isNumeric(text || '', { no_symbols: true });
}

/**
 * Function to validate a passed string is a properly formatted e-mail address
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateEmail(text) {
	return ((text === '') || (validator.isEmail(text)));
}

/**
 * Function to validate that a passed value is not "empty"
 *
 * @param text - the text to test
 * @returns {boolean} asserting whether the text to test is valid
 *
 * @author kinsho
 */
export function validateEmpty(text) {
	return (text.trim() !== '');	
}

/**
 * Function to validate a set of properties against preset validator functions
 *
 * @param test - a collection of tests to run through
 * @returns array<String> - a list of error messages to display should any of the tests fail
 *
 * @author kinsho
 */
export function runValidators(tests) {
	let errorMessages = [];

	for (let i = 0; i < tests.length; i += 1) {
		if (tests[i].validator(tests[i].prop) === false) {
			errorMessages.push(tests[i].errorMsg);
		}
	}

	return errorMessages;
}