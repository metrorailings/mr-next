import React, { Suspense } from 'react';
import Image from "next/image";

import styles from "public/styles/page/lib/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { publish } from 'lib/utils';
import { SubLoader } from 'lib/loaderIcons';

const GalleryViewer = ({ images, imgWidth, imgHeight, allowDelete }) => {
	
	const viewImage = (event) => {
		publish('open-viewer', { currentIndex : event.currentTarget.key, photos : images });
	};

	return (
		<>
			{ images.map((image, index) => {
				return (
					<>
						<div className={ styles.thumbnail_container }>
							<Suspense fallback={ <SubLoader /> }>
								<Image
									src={ image.src }
									width={ imgWidth }
									height={ imgHeight }
									alt={ image.title }
									key={ index }
									onClick={ viewImage }
								/>
								{ allowDelete ? (
									<FontAwesomeIcon icon={ faTimes } className={ styles.file_delete_icon }/>
								) : null }
							</Suspense>
						</div>
					</>
				);
			})}
		</>
	);
};

export default GalleryViewer;