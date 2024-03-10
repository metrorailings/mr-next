import dbConnect from "lib/database";
import { logServerDatabaseCall } from "lib/logger";

import Gallery from "lib/models/gallery";

/**
 * Function to retrieve all gallery pictures
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function getGalleryImages(start = 0, end = 10000) {
	await dbConnect();
	logServerDatabaseCall('api/gallery/getGalleryImages', { start, end });

	try {
		return await Gallery.find().sort({ index : 1 }).skip(start).limit(end).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getGalleryCount() {
	await dbConnect();
	logServerDatabaseCall('api/gallery/getGalleryCount');

	try {
		return await Gallery.countDocuments({});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to add an individaul instance of new gallery metadata
 *
 * @param {Object} metadata
 */
export async function addGalleryImage(metadata) {
	await dbConnect();
	logServerDatabaseCall('api/gallery/addGalleryImage');

	try {
		await Gallery.create(metadata);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Function to remove individual instance of gallery metadata
 *
 * @param {Object} metadata
 */
export async function deleteGalleryImage(name, index) {
	await dbConnect();
	logServerDatabaseCall('api/gallery/deleteGalleryImage');

	try {
		const dbResult = await Gallery.deleteOne({ index: index, 'blob.pathname': name });
		return (dbResult.deletedCount === 1);
	} catch (error) {
		console.error(error);
		return false;
	}
}