'use client'

import React, { useState, useRef, useEffect } from 'react';

import { addGalleryImage } from 'actions/gallery';

import { serverActionCall } from 'lib/http/clientHttpRequester';
import { getUserSession } from 'lib/userInfo';

import styles from 'public/styles/page/gallery.module.scss';

const AddForm = () => {
	const [user, setUser] = useState('');
	const [formSubmitted, setFormSubmitted] = useState(false);

	const fileInputRef = useRef(null);
	const formRef = useRef(null);

	const	uploadImage = async () => {
		if (fileInputRef.current.value) {
			setFormSubmitted(true);
			const serverResponse = await serverActionCall(addGalleryImage, new FormData(formRef.current), {
				loading: 'Uploading a new gallery image...',
				error: 'Something went wrong when trying to upload a new image. See Rickin for help here.',
				success: 'The image has been uploaded. Refreshing page...'
			});
			setFormSubmitted(false);

			if (serverResponse.success) {
				window.setTimeout(() => window.location.reload(), 1000);
			}
		}
	};

	useEffect(() => {
		setUser(getUserSession().username);
	}, []);

	return (
		<form className={ styles.galleryFooter } action={ addGalleryImage } ref={ formRef }>
			<input
				type='file'
				name='galleryImage'
				className={ styles.uploadGalleryFileInput }
				accept='.jpeg,.jpg,.png'
				onChange={ uploadImage }
				ref={ fileInputRef }
			/>
			<input type='hidden' name='uploader' value={ user } />
			<button type='button' className={ styles.uploadNewPicturesButton } onClick={ () => fileInputRef.current.click() } disabled={ formSubmitted }>Add a New Image</button>
		</form>
	);
}

export default AddForm;