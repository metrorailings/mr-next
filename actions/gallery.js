'use server'

import { uploadToVercel, addGalleryImage as addGalleryImageServer } from 'lib/http/galleryDAO';

export async function addGalleryImage(formData) {
	const imageFile = formData.get('galleryImage');
	const metadata = await uploadToVercel(imageFile);

	try {
		const processedImage = await addGalleryImageServer(metadata);
		return { success: true, data: processedImage };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}