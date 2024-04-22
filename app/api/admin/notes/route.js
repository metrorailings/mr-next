import { NextResponse } from 'next/server';

import dbConnect from 'lib/database';
import { logRequest } from 'lib/logger';
import { getNotes } from 'lib/http/notesDAO';
import { addNewNoteToOrder } from 'lib/http/ordersDAO';

import Notes from 'lib/models/note';
import Counters from 'lib/models/counters';

/**
 * Method to retrieve all the notes in the system
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
	const params = request.nextUrl.searchParams;

	try {
		const notes = await getNotes(params);
		return NextResponse.json(notes, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Server issue' }, { status: 500 });
	}
}

/**
 * Method to update any one note
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
	await dbConnect();
	const payloadData = await request.json();
	const username = JSON.parse(request.cookies.get('user').value).username;
	logRequest('api/admin/notes', 'POST', payloadData);

	let { noteId, noteData } = payloadData;

	// Update the note metadata with timestamp and updater information
	noteData = recordUpdateInfo(noteData, username);

	try {
		const serverResponse = await Notes.updateOne({ _id: noteId }, noteData);
		if (serverResponse.modifiedCount) {
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({ error: 'DB Issue' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server issue" },{ status: 500 });
	}
}

/**
 * Method to register a new note in the system
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request) {
	await dbConnect();
	let noteData = await request.json();

	// Update the note metadata with timestamp and updater information
	noteData.dates = { created: new Date() };
	noteData.author = JSON.parse(request.cookies.get('user').value).username;
	noteData = recordUpdateInfo(noteData, noteData.author);

	// Add in more metadata should the note be a tas
	if (noteData.type === 'task') {
		noteData.assignFrom = noteData.author;
		noteData.status = 'open';
	}

	// Massage out the note text so that line breaks are properly saved
	noteData.text = noteData.text.split('\n').join('<br />');

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('notes', { $inc: { seq: 1 } }).exec();

		// Add the new note inside the notes collection and don't forget to attach it to the order as well
		const processedNote = await Notes.create({
			_id: countersResult.seq,
			...noteData
		});
		const isOrderUpdated = await addNewNoteToOrder(processedNote);

		if (isOrderUpdated) {
			return NextResponse.json({ result: processedNote }, { status: 200 });
		} else {
			throw new Error('There was an issue updating the database. Please try again.');
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server issue" },{ status: 500 });
	}
}

function recordUpdateInfo(noteData, username) {
	noteData.dates.modified = noteData.dates.modified || [];
	noteData.updaters = noteData.updaters || [];
	noteData.dates.modified.push(new Date());
	noteData.updaters.push(username);

	return noteData;
}