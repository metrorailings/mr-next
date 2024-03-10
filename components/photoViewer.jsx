'use client'

import React, { useState, useEffect, Suspense } from 'react';
import Image from "next/image";

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle, faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

import { SubLoader } from 'components/loaderIcons';

const PhotoViewer = ({ photos, currentIndex, closeFunc }) => {

	const [photoIndex, setPhotoIndex] = useState(currentIndex);

	const closeViewer = () => {
		closeFunc();
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

	const navigateWithKeyPresses = (event) => {
		if (event.keyCode === 37) {
			changeCurrentPhoto(event, photoIndex - 1);
		} else if (event.keyCode === 39) {
			changeCurrentPhoto(event, photoIndex + 1);
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', navigateWithKeyPresses);

		return () => { 
			document.removeEventListener('keydown', navigateWithKeyPresses);
		}
	});

	return (
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

					<div className={ styles.galleryPictureViewer }>
						<Suspense fallback={ <SubLoader /> }>
							<Image
								className={ styles.galleryPicture }
								src={ photos[photoIndex].url }
								alt={ photos[photoIndex].pathname || 'Photo' }
								width={ 500 }
								height={ 500 }
								onClick={(event) => { viewOriginalPhoto(event, photos[photoIndex].url) }}
							/>
						</Suspense>
					</div>

					<div className={ styles.galleryControls }>
						<span className={ (photoIndex > 0) ? styles.galleryLeftButton : styles.galleryLeftButtonDisabled }>
							<FontAwesomeIcon
								icon={ faCircleArrowLeft }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex - 1 ) }}
							/>
						</span>
						<span className={ (photoIndex + 1 < photos.length) ? styles.galleryRightButton : styles.galleryRightButtonDisabled }>
							<FontAwesomeIcon
								icon={ faCircleArrowRight }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex + 1 ) }}
							/>
						</span>
					</div>

				</div>
			</div>
		</>
	);
};

export default PhotoViewer;