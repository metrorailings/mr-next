import React, { useState, useEffect, Suspense } from 'react';
import Image from "next/image";

import styles from "public/styles/components/lib/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle, faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

import { subscribe, unsubscribe } from 'lib/utils';
import { SubLoader } from 'lib/loaderIcons';

const PhotoViewer = () => {

	const [isOpen, setIsOpen] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);
	const [photos, setPhotos] = useState([]);

	const openViewer = (event) => {
		setIsOpen(true);
		setPhotos(event.detail.data.photos);
		setPhotoIndex(event.detail.data.currentIndex);
	};

	const closeViewer = () => {
		setIsOpen(false);
		setPhotos([]);
		setPhotoIndex(0);
	};

	const changeCurrentPhoto = (newIndex) => {
		if (newIndex >= 0 && newIndex < photos.length) {
			setPhotoIndex(newIndex);
		}
	};

	const viewOriginalPhoto = (url) => {
		window.open(url, '_blank');
	}

	useEffect(() => {
		subscribe('open-viewer', openViewer);

		return () => { unsubscribe('open-viewer', openViewer); } 
	}, []);

	return isOpen ? (
		<>
			<div id={ styles.gallery_overlay }>
				<div id={ styles.gallery_container }>

					<div id={ styles.gallery_exit_row }>
						<FontAwesomeIcon
							icon={ faXmarkCircle }
							onClick={ closeViewer }
						/>
					</div>

					<Suspense fallback={ <SubLoader /> }>
						<div id={ styles.gallery_picture_viewer }>
							<Image
								id={ styles.gallery_picture }
								src={ photos[photoIndex].src }
								alt={ photos[photoIndex].title || 'Photo' }
								width={500}
								height={500}
								onClick={() => { viewOriginalPhoto(photos[photoIndex].src) }}
							/>
						</div>
					</Suspense>

					<div id={ styles.gallery_controls }>
						<span id={ styles.gallery_left_button }>
							<FontAwesomeIcon
								icon={ faCircleArrowLeft }
								onClick={ () => { changeCurrentPhoto(photoIndex - 1 ) }}
								disabled={ photoIndex === 0 }
							/>
						</span>
						<span id={ styles.gallery_right_button }>
							<FontAwesomeIcon
								icon={ faCircleArrowRight }
								onClick={ () => { changeCurrentPhoto(photoIndex + 1 ) }}
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