'use client'

import React, { useState, useRef, Suspense } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';

import { GALLERY_API } from 'lib/http/apiEndpoints';
import { getUserSession } from 'lib/userInfo';
import { publish } from 'lib/utils';

import styles from 'public/styles/page/gallery.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { httpRequest } from 'lib/http/clientHttpRequester';

const GalleryPage = ({ jsonImages }) => {

	const [existingPhotos, setExistingPhotos] = useState(JSON.parse(jsonImages));

	const uploadLink = useRef(null);

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-viewer', { currentIndex: index, photos: existingPhotos });
	};

	// Function to delete a gallery image permanently
	const deleteImage = (photo) => {
		publish('open-confirm-modal', {
			text: 'Are you sure you want to delete the following image from the gallery permanently?',
			image: photo,
			confirmFunction: deleteImageConfirm
		});
	};

	const deleteImageConfirm = (photo) => {
		console.log(photo);
	}

	const uploadPictures = async (event) => {
		event.preventDefault();

		// Dismiss any lingering toasts
		toast.dismiss();

		const filesToUpload = event.currentTarget.files;

		// @TODO - Find a way to limit files by size here		

		let newPhotos = [];
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
					url: newBlob.url,
					pathname: newBlob.pathname,
					size: newBlob.size,
					index: latestGallery.length + 1,
					uploader: getUserSession().username,
					uploadDate: new Date(),
					tags: [],
				};
				await httpRequest(GALLERY_API.UPLOAD_IMAGE, 'PUT', metadata);

				newPhotos.push(metadata);
			}
		} catch (err) {
			console.error(err);
		}

		setExistingPhotos([...existingPhotos, ...newPhotos]);
	};

	return (
		<>
			<div className={ styles.pageHeader }>GALLERY MANAGEMENT</div>
			<div className={ styles.galleryPictures }>
				{ existingPhotos.map((photo, index) => {
					return (
						<div className={ styles.imageContainer } key={ index }>
							<Image
								src={ photo.url }
								alt={ photo.pathname }
								fill={ true }
								sizes="50vw"
								onClick={ () => viewImage(index) }
							/>
							<FontAwesomeIcon icon={ faCircleXmark } className={ styles.photoDeleteIcon } onClick={ () => deleteImage(photo) } />
							<span className={ styles.photoIndex }>{ photo.index }</span>
						</div>
					);
				})}
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