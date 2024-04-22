import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Users from 'lib/models/user';

/**
 * Function to retrieve a list of all user, filtered by roles and permissions
 *
 * @param [role] - a given role if we're only targeting users of a certain role
 * @param [permission] - a given permission if we're only targeting users with certain permissions
 *
 * @returns {Promise<NextResponse>}
 */
export async function getUsers(role, permission) {
	await dbConnect();
	logServerDatabaseCall('lib/http/usersDAO/getUsers');

	let filters = {};
	if (role) {
		filters.role = role;
	}
	if (permission) {
		filters.permissions[permission] = true;
	}

	try {
		return await Users.find(filters).sort({ username : 1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}