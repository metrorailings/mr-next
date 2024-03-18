'use server'

import { revalidatePath } from 'next/cache';

import { getGalleryImages, getGalleryCount, uploadToVercel, addGalleryImage as addGalleryImageServer } from 'lib/http/galleryDAO';

export async function addGalleryImage(formData) {
	const imageFile = formData.get('galleryImage');
	const { originalBlob, galleriaBlob, thumbnailBlob } = await uploadToVercel(imageFile);

	try {
		const metadata = {
			originalUrl: originalBlob.url,
			galleriaUrl: galleriaBlob.url,
			name: originalBlob.pathname.split('-')[0],
			alt: originalBlob.pathname.split('-')[0],
			index: (await getGalleryCount()) + 1,
			uploader: formData.get('uploader'),
			uploadDate: new Date(),
			tags: []
		};
		await addGalleryImageServer(metadata);

		revalidatePath('/admin/gallery');
	} catch (error) {
		console.error(error);
	}
}

export async function getMoreGalleryImages(start, end) {
	try {
		const images = await getGalleryImages(start, end);
		return JSON.stringify(images);
	} catch (error) {
		console.error(error);
		return JSON.stringify([]);
	}
}