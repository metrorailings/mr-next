'use client'

import React, { useState, useEffect, Suspense } from 'react';
import Image from "next/image";

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle, faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

import { subscribe, unsubscribe } from 'lib/utils';

import { SubLoader } from 'components/loaderIcons';

const PhotoViewer = () => {

	const [isOpen, setIsOpen] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);
	const [photos, setPhotos] = useState([]);

	const openViewer = (event) => {
		setIsOpen(true);
		setPhotos(event.detail.photos);
		setPhotoIndex(event.detail.currentIndex);
	};

	const closeViewer = () => {
		setIsOpen(false);
		setPhotos([]);
		setPhotoIndex(0);
	};

	const changeCurrentPhoto = (event, newIndex) => {
		event.stopPropagation();

		if (newIndex >= 0 && newIndex < photos.length) {
			setPhotoIndex(newIndex);
		}
	};

	const viewOriginalPhoto = (event, url) => {
		event.stopPropagation();

		window.open(url, '_blank');
	}

	useEffect(() => {
		subscribe('open-viewer', openViewer);

		return () => { 
			unsubscribe('open-viewer', openViewer);
		}
	}, [isOpen]);

	return isOpen ? (
		<>
			<div className={ styles.galleryOverlay } onClick={ closeViewer }>
				<div className={ styles.galleryContainer }>

					<div className={ styles.galleryExitRow }>
						<FontAwesomeIcon
							icon={ faXmarkCircle }
							onClick={ closeViewer }
							className={ styles.galleryExitButton }
						/>
					</div>

					<Suspense fallback={ <SubLoader /> }>
						<div className={ styles.galleryPictureViewer }>
							<Image
								className={ styles.galleryPicture }
								src={ photos[photoIndex].url }
								alt={ photos[photoIndex].pathname || 'Photo' }
								width={ 500 }
								height={ 500 }
								onClick={(event) => { viewOriginalPhoto(event, photos[photoIndex].url) }}
							/>
						</div>
					</Suspense>

					<div className={ styles.galleryControls }>
						<span className={ styles.galleryLeftButton }>
							<FontAwesomeIcon
								icon={ faCircleArrowLeft }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex - 1 ) }}
								disabled={ photoIndex === 0 }
							/>
						</span>
						<span className={ styles.galleryRightButton }>
							<FontAwesomeIcon
								icon={ faCircleArrowRight }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex + 1 ) }}
								disabled={ photoIndex + 1 === photos.length }
							/>
						</span>
					</div>

				</div>
			</div>
		</>
	) : null;
};

export default PhotoViewer;