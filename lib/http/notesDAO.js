import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';
import Notes from 'lib/models/user';

/**
 * Function to retrieve all notes, filtered by whatever parameters are passed
 *
 * @param filters - the filters to pass directly to MongoDB when retrieving the results
 *
 * @returns {Promise<NextResponse>}
 */
export async function getNotes(filters) {
	await dbConnect();
	logServerDatabaseCall('lib/http/notesDAO/getNotes');

	try {
		const notes = await Notes.get(filters).sort({ date : -1 }).exec();
		return notes;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}
