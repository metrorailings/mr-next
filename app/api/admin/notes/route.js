import { NextResponse } from 'next/server';

import { getNotes, updateNoteTask, addNote, addTask } from 'lib/http/notesDAO';
import { addNewNoteToOrder } from 'lib/http/ordersDAO';

/**
 * Method to retrieve any note(s) from the database
 *
 * @param request
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
	const payloadData = await request.json();
	const username = JSON.parse(request.cookies.get('user').value).username;

	let { noteId, noteData } = payloadData;

	try {
		await updateNoteTask(noteId, noteData, username);
		return NextResponse.json({}, { status: 200 });
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
	const payloadData = await request.json();
	const username = JSON.parse(request.cookies.get('user').value).username;

	try {
		const processedNote = (payloadData.type === 'task' ? await addTask(payloadData, username) : await addNote(payloadData, username));
		// Add the note to the order it belongs to as well, if the note was created with an order in context
		if (!(payloadData.orderId) || await addNewNoteToOrder(processedNote)) {
			return NextResponse.json({ result: processedNote }, { status: 200 });
		} else {
			return NextResponse.json({ error: 'Some sort of database issue here preventing us from updating the note properly. Please try again.' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server issue" },{ status: 500 });
	}
}

