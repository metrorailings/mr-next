import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

import { getGalleryImages, addGalleryImage, deleteGalleryImage } from 'app/api/gallery/DAO';

/**
 * Function to retrieve all gallery-related metadata from the database
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
	const params = request.nextUrl.searchParams;

	try {
		const images = await getGalleryImages(params?.start || 0, params?.end);
		return NextResponse.json(images, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server issue' }, { status: 500 });
	}
}

/**
 * Function to upload metadata regarding a new gallery picture into our database
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request) {
	const metadata = await request.json();

	try {
		if (await addGalleryImage(metadata)) {
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({ error: 'Could not upload the gallery metadata for some reason' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server issue' }, { status: 500 });
	}
}

/**
 * Function to delete an image from our gallery
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request) {
	const params = request.nextUrl.searchParams;

	try {
		if (await deleteGalleryImage(params.pathname, params.index)) {
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({ error: 'Error attempting to delete a gallery image from the database' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Strange issue when trying to delete a gallery image' }, { status: 500 });
	}
}

/**
 * Method to guide the upload of media directly to Vercel from the client
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
	const body = await request.json();

	try {
		// Note that the two functions being passed into handleUpload need to be explicitly async, regardless of the
		// presence of the await keyword 
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: (pathname) => {

				console.log('About to upload an image - ' + pathname);

				return {
					allowedContentTypes: ['image/jpeg', 'image/png']
				};
			},
			onUploadCompleted: ({ blob, tokenPayload }) => {
				console.log('Media has been uploaded -- ', blob, tokenPayload);
			}
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		// Do note that the webhook will retry 5 times waiting for a status 200;
		console.error(error);
		return NextResponse.json({ error: "Upload issue" },{ status: 500 });
	}
}