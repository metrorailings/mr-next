import { NextResponse } from 'next/server';

import { attachFileMetadata } from 'lib/http/ordersDAO';

/**
 * Function to store/modify file metadata for a given order
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
	const payloadData = await request.json();
	const blob = payloadData.blob;

	try {
		if (await attachFileMetadata(blob)) {
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({ error: 'Could not upload the file metadata for some reason' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server issue' }, { status: 500 });
	}
}