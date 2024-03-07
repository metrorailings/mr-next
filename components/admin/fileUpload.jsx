import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';

import styles from "public/styles/page/components.module.scss";

import GalleryViewer from 'components/galleryViewer';

import { getUserSession } from 'lib/userInfo';
import { acceptableMediaExtensions } from 'lib/dictionary';
import { ORDER_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

const FileUpload = ({ orderId, existingFiles, lazyLoad }) => {

	existingFiles = existingFiles || [];
	const [media, setMedia] = useState(existingFiles.filter( (file) => acceptableMediaExtensions[file.contentType]) );
	const [nonMedia, setNonMedia] = useState( existingFiles.filter((file) => !(acceptableMediaExtensions[file.contentType])) );
	const [showMedia, setShowMedia] = useState(!(lazyLoad));
	const [showNonMedia, setShowNonMedia] = useState(!(lazyLoad));
	const [user, setUser] = useState(null);

	const uploadLink = useRef();

	const uploadFiles = async (event) => {
		event.preventDefault();

		// Dismiss any lingering toasts
		toast.dismiss();

		const filesToUpload = event.currentTarget.files;

		// @TODO - Find a way to limit files by size here		

		try {
			for (let i = 0; i < filesToUpload.length; i += 1) {
				let newBlob = await upload(filesToUpload[i].name, filesToUpload[i], {
					access: 'public',
					handleUploadUrl: ORDER_API.POST_UPLOAD_FILE,
					clientPayload: { orderId : orderId },
					multipart: filesToUpload[i].size >= 5000000 // Break apart any files greater than 5 MBs in size  
				});
				
				// @TODO - Use toast to notify the user about the status of the upload

				// Update the blob to include metadata specific to our application
				// Please note that in production, the blob's metadata has been automatically updated and stored in the
				// database while we were uploading the file
				newBlob.orderId = orderId;
				newBlob.uploader = user.username;

				// The following block of code only executes on my local machine, as the whole Vercel Blob process never
				// really finishes on local machines for some strange reason 
				if (process.env.NEXT_PUBLIC_DOMAIN === 'localhost') {
					newBlob = await httpRequest(ORDER_API.SAVE_UPLOAD_METADATA, 'POST', { blob : newBlob });
				}

				if (acceptableMediaExtensions[newBlob.contentType]) {
					setMedia([...media, newBlob]);
				} else {
					setNonMedia([...media, newBlob]);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		setUser(getUserSession());
	}, []);

	return (
		<>
			{ user?.permissions?.uploadFile ? (
				<>
					<div className={ styles.fileUploadSection }>
						<button className={ styles.uploadFileButton } onClick={() => uploadLink.current.click() }>Upload Media/File</button>
						<input
							type='file'
							ref={ uploadLink }
							className={ styles.uploadFileInput }
							multiple
							accept='.pdf,.jpeg,.jpg,.mp4,.png'
							onChange={ uploadFiles }
						/>
					</div>
				</>
			) : null }

			<div className={ styles.filesListing }>

				{ media.length ? (
					<div className={ styles.filesContainer }>
						<div className={ styles.filesContainerHeader }>
							{ user?.role === "shop" ? "Fotos" : "Pictures" }
						</div>
						{ showMedia === true ? (
							<GalleryViewer
								files={ media }
								imgWidth={ 150 }
								imgHeight={ 150 }
								allowDelete={ user?.role === "admin" || user?.role === "office" }
							/>
						) : (
							<span className={ styles.seeFilesLink } onClick={() => setShowMedia(true) }>
								{ user?.role === "shop" ?  "Cargar Todas Las Fotos..." : "Load All Pictures..." }
							</span>
						)}
					</div>
				) : null }

				{ nonMedia.length ? (
					<div className={ styles.filesContainer }>
						<div className={ styles.filesContainerHeader }>
							{ user?.role === "shop" ? "Dibujos" : "Drawings" }
						</div>
						{ showNonMedia === true ? (
							<GalleryViewer
								files={ nonMedia }
								imgWidth={ 150 }
								imgHeight={ 150 }
								allowDelete={ user?.role === "admin" || user?.role === "office" }
							/>
						) : (
							<span className={ styles.seeFilesLink } onClick={() => setShowNonMedia(true) }>
								{ user?.role === "shop" ?  "Cargar Todos Los Dibujos..." : "Load All Drawings..." }
							</span>
						)}
					</div>
				) : null }

			</div>
		</>
	);
};

export default FileUpload;