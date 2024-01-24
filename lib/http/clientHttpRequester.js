'use client'

import { gatherQueryParams } from "lib/utils";
import { logResponse } from "lib/logger";

/**
 * Wrapper for all calls to the Metro Railings API
 *
 * @param {string} url - url of the API endpoint
 * @param {string} httpMethod - the HTTP method denoting the nature of the request
 * @param {object} payload
 *
 * @author kinsho
 */
export function httpRequest(url, httpMethod, payload = {}) {
	let fetchOptions = {};
	let queryString = '';

	// For certain HTTP calls, parameters (if any) can only be passed through the URL inside the request
	if (httpMethod === 'GET') {
		queryString = gatherQueryParams(payload);
	}

	// Build out the options that the fetch call will be using to construct the request
	// Ensure that a bearer token is attached should the authentication flag be set
	// Only accept JSON data back from the server
	fetchOptions.method = httpMethod;
	fetchOptions.headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};
	fetchOptions.body = payload instanceof FormData ? payload : JSON.stringify(payload);

	// Log the nature of this server call
	console.log("About to make a " + httpMethod + " call to " + url);
	console.log("--------- Payload ------------");
	console.log(payload);

	return new Promise((resolve, reject) => {
		try {
			fetch(url + queryString, fetchOptions)
				.then((res) => {
					return res.json();
				})
				.then((res) => {
					logResponse(url, httpMethod, res);
					if (res.status === 200) {
						resolve(res);
					} else {
						console.log(res);
						reject(res);
					}
				})
				.catch((err) => {
					console.error("(Fetch) " + httpMethod + " error: ", err);
					reject(err);
				});
		} catch(err) {
			console.log("System error?");
			reject(err);
		}
	});
}