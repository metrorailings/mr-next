'use client'

import Image from 'next/image';

import { publish } from 'lib/utils';

import styles from 'public/styles/page/gallery.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Gallery = ({ jsonImages }) => {

	const images = JSON.parse(jsonImages);

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images });
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

	return (
		<div className={ styles.galleryPictures }>
			{ images.map((photo, index) => {
				return (
					<div className={ styles.imageContainer } key={ index }>
						<Image
							src={ photo.url }
							alt={ photo.alt || 'photo' }
							fill={ true }
							sizes="50vw"
							onClick={ () => viewImage(index) }
						/>
						<FontAwesomeIcon icon={ faCircleXmark } className={ styles.photoDeleteIcon } onClick={ () => deleteImage(photo) }/>
						<span className={ styles.photoIndex }>{ photo.index }</span>
					</div>
				);
			})}
		</div>
	);
}

export default Gallery;