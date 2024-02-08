'use client'

import dayjs from "dayjs";

// Class to manage a copy of the user profile in local memory so that we can reference the permissions outlined for
// that user on the client side

/**
 * Clear out the user session from local storage
 *
 * @author kinsho
 */
export function clearUserSession() {
	window.localStorage.removeItem('mr-user');
}

/**
 * Store a new user session into local storage
 *
 * @param Object - the user profile to store
 *
 * @author kinsho
 */
export function storeUserSession(session) {
	const now = dayjs();
	session.expiration = now.add(1, 'month');

	window.localStorage.setItem('mr-user', session);
}

/**
 * Retrieves a user session from local storage
 *
 * @author kinsho
 */
export function getUserSession() {
	const now = dayjs();
	const session = window.localStorage.getItem('mr-user');

	// Ensure that a viable session is there and that it hasn't expired as of yet
	if (session?.expiration && now.isBefore(session.expiration)) {
		return session;
	} else {
		return null;
	}
}