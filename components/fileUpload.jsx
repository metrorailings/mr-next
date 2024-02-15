import React, { useState, useRef, useEffect } from 'react';
import { upload } from '@vercel/blob/client';

import styles from "public/styles/page/file_upload.module.scss";

import GalleryViewer from 'components/galleryViewer';

import { getUserSession } from 'lib/userInfo';
import { acceptableMediaExtensions } from 'lib/dictionary';
import { ORDER_API } from 'lib/http/apiEndpoints';

const FileUpload = ({ orderId, existingFiles, lazyLoad }) => {

	existingFiles = existingFiles || [];
	const [media, setMedia] = useState(existingFiles.filter((file) => acceptableMediaExtensions[file.name.split('.').pop().toLowerCase()]));
	const [nonMedia, setNonMedia] = useState(existingFiles.filter((file) => !(acceptableMediaExtensions[file.name.split('.').pop().toLowerCase()])));
	const [user, setUser] = useState(null);

	const uploadFiles = async (event) => {
		event.preventDefault();

		const filesToUpload = event.currentTarget.files;

		for (let i = 0; i < filesToUpload.length; i += 1) {
			const newBlob = await upload(filesToUpload[i].name, filesToUpload[i], {
				access: 'public',
				handleUploadUrl: ORDER_API.POST_UPLOAD_FILE,
				clientPayload: orderId,
				multipart: filesToUpload[i].size >= 5000000 // Break apart any files greater than 5 MBs in size  
			});

			if (acceptableMediaExtensions(newBlob.contentType)) {
				setMedia([...media, newBlob]);
			} else {
				setNonMedia([...media, newBlob]);
			}
		}
	};

	const uploadLink = useRef();

	useEffect(() => {
		setUser(getUserSession());
	}, []);

	return (
		<>
			{ user?.permissions?.uploadFile ? (
				<>
					<div className={ styles.file_upload_section }>
						<span className={ styles.label }>Upload a File?</span>
						<button className={ styles.upload_file_button } onClick={() => uploadLink.current.click() }>Upload Media/File</button>
						<input
							type='file'
							ref={ uploadLink }
							className={ styles.file_upload_input }
							multiple
							accept='.pdf,.jpeg,.jpg,.mp4,.png'
							onChange={ uploadFiles }
						/>
					</div>
				</>
			) : null }

			<div className={ styles.files_listing }>

				{ media.length ? (
					<div className={ styles.files_container }>
						<div className={ styles.upload_container_header }>
							{ user?.role === "shop" ? "Fotos" : "Pictures" }
						</div>
						{ !!(lazyLoad) === false ? (
							<GalleryViewer
								files={ media }
								imgWidth={ 64 }
								imgHeight={ 64 }
								allowDelete={ user?.role === "admin" || user?.role === "office" }
							/>
						) : (
							user?.role === "shop" ?  "Cargar Todas Las Fotos..." : "Load All Pictures..."
						)}
					</div>
				) : null }

				{ nonMedia.length ? (
					<div className={ styles.files_container }>
						<div className={ styles.upload_container_header }>
							{ user?.role === "shop" ? "Dibujos" : "Drawings" }
						</div>
						{ !!(lazyLoad) === false ? (
							<GalleryViewer
								files={ nonMedia }
								imgWidth={ 64 }
								imgHeight={ 64 }
								allowDelete={ user?.role === "admin" || user?.role === "office" }
							/>
						) : (
							user?.role === "shop" ?  "Cargar Todos Los Dibujos..." : "Load All Drawings..."
						)}
					</div>
				) : null }

			</div>
		</>
	);
};

export default FileUpload;