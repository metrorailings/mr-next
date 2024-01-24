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