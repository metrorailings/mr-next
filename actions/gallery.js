'use server'

import { cookies } from 'next/headers';

import {
	addGalleryImage as addGalleryImageDAO,
	getGalleryCount,
	updateGalleryImageData,
	deleteGalleryImage as deleteGalleryImageDAO,
	uploadToVercel,
	deleteFromVercel,
} from 'lib/http/galleryDAO';

export async function addNewGalleryImage(formData) {
	const imageFile = formData.get('galleryImage');
	const uploader = JSON.parse(cookies().get('user').value).username;

	try {
		const metadata = await uploadToVercel(imageFile);
		const completeMetadata = {
			...metadata,
			index: (await getGalleryCount()) + 1,
			uploader: uploader,
			uploadDate: new Date(),
			tags: [],
			category: ''
		}
		
		const processedImage = await addGalleryImageDAO(completeMetadata);
		return { success: true, data: JSON.stringify(processedImage) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function deleteGalleryImage(data) {
	// Flag is needed as only the first database operation is necessary to meaningfully delete the image from the database
	// Second operation is just clean-up
	let meaningfullyDeleted = false;

	try {
		if (await deleteGalleryImageDAO(data.name, data.index)) {
			meaningfullyDeleted = true;
		}
		deleteFromVercel(data.originalUrl, data.galleriaUrl);
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: meaningfullyDeleted };
	}
}

export async function updateGalleryMetadata(updatedMetadata){
	try {
		await updateGalleryImageData(updatedMetadata);
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}