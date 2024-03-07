'use client'

import React, { useState, useRef, Suspense } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';

import { GALLERY_API } from 'lib/http/apiEndpoints';
import { getUserSession } from 'lib/userInfo';

import styles from 'public/styles/page/gallery.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { httpRequest } from 'lib/http/clientHttpRequester';

const GalleryPage = ({ jsonImages }) => {

	const [existingPhotos, setExistingPhotos] = useState(JSON.parse(jsonImages));

	const uploadLink = useRef(null);

	const uploadPictures = async (event) => {
		event.preventDefault();

		// Dismiss any lingering toasts
		toast.dismiss();

		const filesToUpload = event.currentTarget.files;

		// @TODO - Find a way to limit files by size here		

		try {
			for (let i = 0; i < filesToUpload.length; i += 1) {
				let newBlob = await upload(filesToUpload[i].name, filesToUpload[i], {
					access: 'public',
					handleUploadUrl: GALLERY_API.UPLOAD_IMAGE,
					multipart: filesToUpload[i].size >= 5000000 // Break apart any files greater than 5 MBs in size  
				});

				// @TODO - Use toast to notify the user about the status of the upload

				const latestGallery = await httpRequest(GALLERY_API.UPLOAD_IMAGE, 'GET');
				const metadata = {
					blob: newBlob,
					uploader: getUserSession().username,
					tags: [],
					index: latestGallery.length + 1
				};
				await httpRequest(GALLERY_API.UPLOAD_IMAGE, 'PUT', metadata);

				setExistingPhotos([...existingPhotos, metadata]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<div className={ styles.pageHeader }>GALLERY MANAGEMENT</div>
			<div className={ styles.galleryPictures }>
				{ /* @TODO - Update the suspense logic so that it works. */ }
				<Suspense fallback={ <p>Waiting...</p> }>
					{ existingPhotos.map((photo, index) => {
						return (
							<div className={ styles.imageContainer } key={ index }>
								<Image
									src={ photo.blob.url }
									alt={ photo.blob.pathname }
									fill={ true }
									sizes="50vw"
								/>
								<FontAwesomeIcon icon={ faCircleXmark } className={ styles.photoDeleteIcon } />
								<span className={ styles.photoIndex }>{ photo.index }</span>
							</div>
						);
					})}
				</Suspense>
			</div>
			<div className={ styles.galleryFooter }>
				<button className={ styles.uploadNewPicturesButton } onClick={ () => uploadLink.current.click() }>Upload to
					Gallery
				</button>
				<input
					type='file'
					ref={ uploadLink }
					className={ styles.uploadFileInput }
					multiple
					accept='.jpeg,.jpg,.png'
					onChange={ uploadPictures }
				/>
			</div>
		</>
	);
};

export default GalleryPage;