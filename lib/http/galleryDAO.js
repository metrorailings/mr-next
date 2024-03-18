import sharp from 'sharp';
import { put } from '@vercel/blob';
import randomStr from 'randomstring';

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
		const images = await Gallery.find().sort({ index : 1 }).skip(start).limit(end).exec();
		return images;
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

/**
 * Function to upload a new photo directly to Vercel's Blob storage service
 *
 * @param {Object} imageFile
 */
export async function uploadToVercel(imageFile) {
	const imageBlob = await (new Blob([imageFile])).arrayBuffer();
	const sharpImage = sharp(imageBlob).withMetadata();

	try {
		// Generate a random name for the new image prior to upload
		const generatedName = randomStr.generate({ length : 9 }) + '.' + imageFile.name.split('.').pop();

		// Create three separate copies of the image, each in different sizes
		const processedImage = {
			galleria: sharpImage.resize(null, 750),
			original: imageFile
		};

		// Upload to Vercel using their Blob API
		const galleriaBlob = await put('gallery/galleria/' + generatedName, processedImage.galleria, { access: 'public' });
		const originalBlob = await put('gallery/original/' + generatedName, processedImage.original, { access: 'public' });

		return { originalBlob, galleriaBlob };
	} catch (error) {
		console.error(error);
		throw error;
	}
}