// Utility file containing methods that can be leveraged across different server components
import crypto from "crypto";

/**
 * Function responsible for hashing a string using the SHA-256 algorithm and a secret key stored in our environment
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface
 *
 * @param {String} text
 */
export function hashWithSecret(text) {
	return crypto.createHmac('sha256', process.env.SECRET).update(text).digest('hex');
}

/**
 * Function responsible for encrypting a string using the AES-192 algorithm and a secret key stored in our environment
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface 
 *
 * @param {String} text
 */
export function encryptWithSecret(text) {
	const iv = Buffer.alloc(16, 0);
	const cipher = crypto.createCipheriv('aes-192-cbc', process.env.SECRET, iv);

	let cipherText = cipher.update(text, 'utf8','hex');
	return cipherText + cipher.final('hex');
}

/**
 * Function responsible for decrypting a AES-192 encoding that was encoded through our secret key at an earlier time
 *
 * @TODO This way of cryptography is sadly deprecated in favor of window.crypto.subtle. So we need to follow suit, either with window.crypto.subtle or a library that takes advantage of the new crypto interface
 *
 * @param {String} text
 */
export function decryptWithSecret(text) {
	const iv = Buffer.alloc(16, 0);
	const decipher = crypto.createDecipheriv('aes-192-cbc', process.env.SECRET, iv);

	let decipheredText = decipher.update(text, 'hex', 'utf8');
	return decipheredText + decipher.final('utf8');
}

/**
 * Given a URLSearchParams object, this function will return an object encapsulating all the key/value pairs stored
 * in the passed object. It gracefully handles array values as well
 */
export function parseQueryParams(urlObject) {
	let queryParams = {};

	urlObject.forEach((value, key) => {
		if (!queryParams[key]) {
			queryParams[key] = [];
		}
		queryParams[key].push(value);
	});

	// Flatten the object if it contains any arrays of a single length
	for (const key in queryParams) {
		if (queryParams[key].length === 1) {
			queryParams[key] = queryParams[key][0];
		}
	}

	return queryParams;
}

/**
 * Given an object of key-value pairs, construct a query string. This function gracefully handles array values as well
 */
export function gatherQueryParams(obj) {
	const keys = Object.keys(obj);
	let kvPairs = [];

	keys.forEach((key) => {
		if (Array.isArray(obj[key])) {
			for (let i = 0; i < obj[key].length; i += 1) {
				kvPairs.push(key + '=' + obj[key][i]);
			}
		} else {
			kvPairs.push(key + '=' + obj[key]);
		}
	});

	if (kvPairs.length) {
		return '?' + kvPairs.join('&');
	}

	return '';
}

/**
 * Function meant to hook a custom listener to the general document
 */
export function subscribe(eventName, listener, subscribeOnlyOnce) {
	console.log('EVENT SUBSCRIBED - ' + eventName);

	// In the event that this subscription can only be made once, ensure any past subscriptions are nullified
	if (subscribeOnlyOnce) {
		document.removeEventListener(eventName, listener);
	}
	document.addEventListener(eventName, listener);
}

/**
 * Function meant to unhook a custom listener from the general document
 */
export function unsubscribe(eventName, listener) {
	console.log('EVENT UNSUBSCRIBED - ' + eventName);

	document.removeEventListener(eventName, listener);
}

/**
 * Function designed to dispatch a custom event
 */
export function publish(eventName, data) {
	console.log('EVENT PUBLISHED - ' + eventName);

	const event = new CustomEvent(eventName, { detail: data });
	document.dispatchEvent(event);
}