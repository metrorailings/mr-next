'use server'

import { revalidatePath } from 'next/cache';

import { getGalleryCount, uploadToVercel, addGalleryImage as addGalleryImageServer } from 'lib/http/galleryDAO';

export async function addGalleryImage(formData) {
	const imageFile = formData.get('galleryImage');
	const { originalBlob, galleriaBlob } = await uploadToVercel(imageFile);

	try {
		const metadata = {
			originalUrl: originalBlob.url,
			galleriaUrl: galleriaBlob.url,
			name: originalBlob.pathname.split('/').pop(),
			alt: originalBlob.pathname.split('/').pop(),
			index: (await getGalleryCount()) + 1,
			uploader: formData.get('uploader'),
			uploadDate: new Date(),
			tags: [],
			category: ''
		};
		await addGalleryImageServer(metadata);

		revalidatePath('/admin/gallery');
	} catch (error) {
		console.error(error);
	}
}