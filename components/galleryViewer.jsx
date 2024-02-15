import React, { Suspense, useRef } from 'react';
import Image from "next/image";

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFile, faFilePdf } from '@fortawesome/free-solid-svg-icons'

import { publish } from 'lib/utils';
import { acceptableMediaExtensions } from 'lib/dictionary';
import { SubLoader } from 'components/loaderIcons';

const GalleryViewer = ({ files, imgWidth, imgHeight, allowDelete }) => {

	const downloadLink = useRef();

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (event) => {
		publish('open-viewer', { currentIndex : event.currentTarget.key, photos : files });
	};

	// Function used to download non-media files
	const downloadFile = (url, title) => {
		downloadLink.current.download = title;
		downloadLink.current.href = url;
		downloadLink.current.click();
	};

	return (
		<>
			{ files.map((file, index) => {
				if (acceptableMediaExtensions[file.name.split('.').pop().toLowerCase()]) {
					return (
						<>
							<div className={ styles.file_thumbnail_container }>
								<Suspense fallback={ <SubLoader /> }>
									<Image
										src={ file.src }
										width={ imgWidth }
										height={ imgHeight }
										alt={ file.title }
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
				} else {
					return (
						<>
							<div className={ styles.file_thumbnail_container }>
								{ file.name.split('.').pop().toLowerCase() === 'pdf' ? (
									<FontAwesomeIcon
										icon={ faFilePdf }
										width={ imgWidth }
										height={ imgHeight }
										key={ index }
										onClick={ () => downloadFile(file.src, file.name) }
									/>
								) : (
									<FontAwesomeIcon
										icon={ faFile }
										width={ imgWidth }
										height={ imgHeight }
										key={ index }
										onClick={ () => downloadFile(file.src, file.name) }
									/>
								)}
							</div>
						</>
					);
				}
			})}
			<a className={ styles.download_link } ref={ downloadLink } href='' download=''></a>
		</>
	);
};

export default GalleryViewer;