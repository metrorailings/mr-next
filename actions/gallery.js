'use server'

import { revalidatePath } from 'next/cache';

import { put } from '@vercel/blob';

import { getGalleryCount, addGalleryImage as addGalleryImageServer } from 'lib/http/galleryDAO';

export async function addGalleryImage(formData) {
	const imageFile = formData.get('galleryImage');

	try {
		const blob = await put(imageFile.name, imageFile, { access: 'public' });

		const metadata = {
			url: blob.url,
			alt: blob.pathname,
			index: (await getGalleryCount()) + 1,
			uploader: formData.get('uploader'),
			uploadDate: new Date(),
			tags: []
		}
		await addGalleryImageServer(metadata);

		revalidatePath('/admin/gallery')
	} catch (error) {
		console.error(error);
	}
}