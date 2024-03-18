import React, { Suspense, useRef } from 'react';
import Image from "next/image";

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faFile, faFilePdf } from '@fortawesome/free-solid-svg-icons'

import { publish } from 'lib/utils';
import { acceptableMediaExtensions } from 'lib/dictionary';
import { SubLoader } from 'components/loaderIcons';

const GalleryViewer = ({ files, imgWidth, imgHeight, allowDelete }) => {

	const downloadLink = useRef();

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: files });
	};

	// Function used to download non-media files
	const downloadFile = (url, title) => {
		downloadLink.current.download = title;
		downloadLink.current.href = url;
		downloadLink.current.click();
	};

	return (
		<div className={ styles.fileCarousel }>
			{ files.map((file, index) => {
				return (
					<div key={ index }>
						{ acceptableMediaExtensions[file.contentType] ? (
							<div className={ styles.fileThumbnailContainer }>
								<Suspense fallback={ <SubLoader/> }>
									<Image
										src={ file.url }
										width={ imgWidth }
										height={ imgHeight }
										alt={ file.pathname }
										index={ index }
										onClick={ () => viewImage(index) }
									/>
									<div className={ styles.thumbnailTitleBar }>{ file.pathname }</div>
									{ allowDelete ? (
										<FontAwesomeIcon icon={ faCircleXmark } className={ styles.fileDeleteIcon }/>
									) : null }
								</Suspense>
							</div>
						) : (
							<div className={ styles.fileThumbnailContainer }>
								{ file.pathname.split('.').pop().toLowerCase() === 'pdf' ? (
									<FontAwesomeIcon
										icon={ faFilePdf }
										width={ imgWidth }
										height={ imgHeight }
										index={ index }
										onClick={() => downloadFile(file.url, file.pathname)}
									/>
								) : (
									<FontAwesomeIcon
										icon={ faFile }
										width={ imgWidth }
										height={ imgHeight }
										key={ index }
										onClick={() => downloadFile(file.url, file.pathname)}
									/>
								)}
								<div className={ styles.thumbnailTitleBar }>{ file.pathname }</div>
								{ allowDelete ? (
									<FontAwesomeIcon icon={ faCircleXmark } className={ styles.fileDeleteIcon }/>
								) : null }
							</div>
						)}
					</div>
				);
			})}
			<a className={ styles.download_link } ref={ downloadLink } href='' download=''></a>
		</div>
	);
}

export default GalleryViewer;