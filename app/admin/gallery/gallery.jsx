'use client'

import React, { useState } from 'react';
import Image from 'next/image';

import { publish } from 'lib/utils';
import { httpRequest } from 'lib/http/clientHttpRequester';
import { GALLERY_API } from 'lib/http/apiEndpoints';

import styles from 'public/styles/page/gallery.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Gallery = ({ jsonImages }) => {

	const [images, setImages] = useState(JSON.parse(jsonImages));
	const [isDeletingPicture, setIsDeletingPicture] = useState(false);

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images });
	};

	// Function to delete a gallery image permanently
	const deleteImage = (photo) => {
		if (isDeletingPicture === false) {
			publish('open-confirm-modal', {
				text: 'Are you sure you want to delete the following image from the gallery permanently?',
				image: photo,
				confirmFunction: () => deleteImageConfirm(photo)
			});
		}
	};

	const deleteImageConfirm = async (photo) => {
		setIsDeletingPicture(true);
		await httpRequest(GALLERY_API.IMAGE, 'DELETE', {
			index: photo.index,
			name: photo.name,
			originalUrl: photo.originalUrl,
			galleriaUrl: photo.galleriaUrl
		}, {
			loading: 'Deleting image...',
			success: 'An image has been successfully deleted.',
			error: 'The image couldn\'t be properly deleted. Try it again.'
		});

		// Easier to reload the page then it is to run through the logic to repaint the DOM
		// TODO: Eventually include logic here to asynchronously update the gallery once the deletion is processed
		setIsDeletingPicture(false);
		window.location.reload();
	}

	const updateImageData = async (event, image, index) => {
		let newImages = [...images];
		newImages[index][event.currentTarget.name] = event.currentTarget.value;
		setImages(newImages);

		await httpRequest(GALLERY_API.IMAGE, 'POST', newImages[index], {
			loading: 'Saving changes...',
			success: 'The image data has been successfully updated.',
			error: 'Changes couldn\'t be saved. Reload the page and try again.'
		}, 2500);
	}

	return (
		<div className={ styles.galleryPictures }>
			{ images.map((photo, index) => {
				return (
					<div className={ styles.imageCard } key={ index }>
						<div className={ styles.imageContainer }>
							<Image
								src={ photo.galleriaUrl }
								alt={ photo.alt || 'Railing' }
								fill={ true }
								sizes='50vw'
								onClick={ () => viewImage(index) }
							/>
							<FontAwesomeIcon
								icon={ faCircleXmark }
								className={ styles.photoDeleteIcon }
								onClick={ () => deleteImage(photo) }
							/>
							<span className={ styles.photoIndex }>{ photo.index }</span>
						</div>
						<div className={ styles.imageDataForm }>
							<div className={ styles.imageDataRow }>
								<label className={ styles.imageDataLabel }>Description</label>
								<input
									type='text'
									name='alt'
									value={ photo.alt }
									className={ styles.imageDataField }
									onChange={ (event) => updateImageData(event, photo, index) }
								/>
							</div>
							<div className={ styles.imageDataRow }>
								<label className={ styles.imageDataLabel }>Category</label>
								<select
									className={ styles.imageDataField }
									value={ photo.category }
									name='category'
									onChange={ (event) => updateImageData(event, photo, index) }
								>
									<option value='' disabled>Select a category</option>
									<option value='cable'>Cable Railing</option>
									<option value='glass'>Glass Railing</option>
									<option value='aluminum'>Aluminum Railing</option>
									<option value='stainless'>Stainless Steel</option>
									<option value='other'>Other</option>
								</select>
							</div>
						</div>
					</div>
				)
					;
			}) }
		</div>
	);
}

export default Gallery;