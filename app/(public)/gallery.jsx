'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import styles from 'public/styles/page/home.module.scss';
import { publish } from 'lib/utils';

const GallerySection = ({ jsonImages }) => {

	const [shownImageCount, setShownImageCount] = useState(6);

	const galleryContainer = useRef(null);

	const images = JSON.parse(jsonImages);

	const loadMoreImages = () => {
		// Only load more images when we have images that have yet to be shown
		if (shownImageCount < images.length) {
			setShownImageCount(Math.min(shownImageCount + 6, images.length));
		}
	}

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images.slice(0, shownImageCount) });
	};

	useEffect(() => {
		galleryContainer.current.style.height = galleryContainer.current.scrollHeight + 'px';
	}, [shownImageCount]);

	return (
		<div className={ styles.gallerySection }>
			<div className={ styles.gallerySectionHeader }>GALLERY</div>
			<p className={ styles.sectionDescriptiveText }>
				We are proud of all our past work. Check out a sampling of the railings we craft with pride.
			</p>
			<div className={ styles.galleryImagesContainer } ref={ galleryContainer }>
				{ Array.from(Array(shownImageCount).keys()).map((value, i) => {
					return (
						<span className={ styles.galleryImageOuterSlot } key={ i }>
							<span className={ styles.galleryImageInnerSlot } onClick={ () => viewImage(i) }>
								<Image
									src={ images[i].galleriaUrl }
									alt={ images[i].alt || 'Luxury railing' }
									fill={ true }
									sizes="(max-width: 768px) 50vw, 33vw"
								/>
							</span>
						</span>
					);
				}) }
			</div>
			{ shownImageCount < images.length ? (
				<div className={ styles.expandGalleryLinkActive } onClick={ loadMoreImages }>- click here for more pictures -</div>
			) : (
				<div className={ styles.expandGalleryLink }>- no more pictures to load -</div>
			)}
		</div>
	);
};

export default GallerySection;