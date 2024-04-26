import React, { useState, useRef, useEffect } from 'react';

import { addFileToOrder, deleteFileFromOrder } from 'actions/order';

import GalleryViewer from 'components/galleryViewer';
import { toastValidationError } from 'components/customToaster';

import { getUserSession } from 'lib/userInfo';
import { acceptableMediaExtensions } from 'lib/dictionary';
import { serverActionCall } from 'lib/http/clientHttpRequester';
import { runValidators } from 'lib/validators/inputValidators';
import { publish } from 'lib/utils';

import styles from "public/styles/page/components.module.scss";

const FileUpload = ({ orderId, existingFiles, lazyLoad }) => {

	existingFiles = existingFiles || [];
	const [media, setMedia] = useState(existingFiles.filter((file) => acceptableMediaExtensions[file.contentType]) );
	const [nonMedia, setNonMedia] = useState( existingFiles.filter((file) => !(acceptableMediaExtensions[file.contentType])) );
	const [showMedia, setShowMedia] = useState(!(lazyLoad));
	const [showNonMedia, setShowNonMedia] = useState(!(lazyLoad));
	const [isDeletingFile, setIsDeletingFile] = useState(false);
	const [user, setUser] = useState(null);

	const uploadLink = useRef(null);
	const uploadForm = useRef(null);

	// ---------- Validation functions for client-side error handling
	// @TODO - add in validation to prevent certain types of file from being uploaded. Also check file sizes

	// ---------- Client-side error tests
	// @TODO - add in client error-side tests once validation functions have been written
	const fileValidationFields = [];

	// Function to upload a new image
	const uploadFiles = async (event) => {
		event.preventDefault();

		const errors = runValidators(fileValidationFields);

		if (errors.length === 0) {
			try {
				const serverResponse = await serverActionCall(addFileToOrder, new FormData(uploadForm.current), {
					loading: 'Uploading the file...',
					success: 'The file\'s been uploaded.',
					error: 'Something went wrong when trying to upload this file. See Rickin for more details.'
				});

				if (serverResponse?.success) {
					const uploadedFile = serverResponse.file;

					if (acceptableMediaExtensions[uploadedFile.contentType]) {
						setMedia([...media, uploadedFile]);
					} else {
						setNonMedia([...nonMedia, uploadedFile]);
					}
				}
			}	catch (err) {
				console.error(err);
			}
		} else {
			toastValidationError(errors);
		}
	};

	// Function to delete a gallery image permanently
	const deleteFile = (file) => {
		if (isDeletingFile === false) {

			// Figure out which image to display inside the modal
			const image = acceptableMediaExtensions[file.contentType] ? file.url : null;

			publish('open-confirm-modal', {
				text: 'Are you sure you want to delete the following file permanently?',
				boldText: file.name || 'Unnamed File',
				image: image,
				confirmFunction: () => deleteFileConfirm(file)
			});
		}
	};

	const deleteFileConfirm = async (fileToDelete) => {
		setIsDeletingFile(true);
		const serverResponse = await serverActionCall(deleteFileFromOrder, {
			orderId: fileToDelete.orderId,
			fileId: fileToDelete._id,
			fileUrl: fileToDelete.url
		}, {
			loading: 'Deleting the file...',
			success: 'The file\'s been deleted.',
			error: 'Something went wrong when trying to delete this file. See Rickin for more details.'
		});

		// After the file is deleted successfully from the server, update our local copy of the data as well to reflect the deletion
		if (serverResponse?.success) {
			if (acceptableMediaExtensions[fileToDelete.contentType]) {
				setMedia(media.filter((file) => (file._id !== fileToDelete._id)));
			} else {
				setNonMedia(nonMedia.filter((file) => (file._id !== fileToDelete._id)));
			}
		}
		setIsDeletingFile(false);
	}

	useEffect(() => {
		setUser(getUserSession());
	}, []);

	return (
		<>
			{ user?.permissions?.uploadFile ? (
				<>
					<div className={ styles.fileUploadSection }>
						<button className={ styles.uploadFileButton } onClick={() => uploadLink.current.click() }>Upload Media/File</button>
						<form ref={ uploadForm } action={ addFileToOrder }>
							<input
								type='file'
								ref={ uploadLink }
								name='newFile'
								className={ styles.uploadFileInput }
								multiple
								accept='.pdf,.jpeg,.jpg,.mp4,.png'
								onChange={ uploadFiles }
							/>
							<input type='hidden' name='orderId' value={ orderId } />
							<input type='hidden' name='uploader' value={ user?.username } />
						</form>
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
								deleteFunc={ (user?.role === 'admin' || user?.role === 'office') ? deleteFile : null }
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
								deleteFunc={ (user?.role === 'admin' || user?.role === 'office') ? deleteFile : null }
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