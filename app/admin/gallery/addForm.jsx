'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { addGalleryImage } from 'actions/gallery';

import { getUserSession } from 'lib/userInfo';

import styles from 'public/styles/page/gallery.module.scss';
import componentStyles from 'public/styles/page/components.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Button = ({ triggerUpload }) => {
	const { pending } = useFormStatus();

	return (
		<button 
			disabled={ pending }
			type='button'
			className={ styles.uploadNewPicturesButton }
			onClick={ triggerUpload }
		>
			{ pending ? (
				<>
					<FontAwesomeIcon icon={ faCircleNotch } className={ componentStyles.rotateSpinner }/>
					Uploading...
				</>
			) : 'Add a New Image' }
		</button>
	);
}

const AddForm = () => {
	const [user, setUser] = useState('');
	const inputLink = useRef(null);

	const	uploadImage = () => {
		// TODO: Instead of a server action, use fetch to relay the new picture to the server
		if (inputLink.current.value) {
			inputLink.current.form.requestSubmit();
		}
	};

	useEffect(() => {
		setUser(getUserSession().username);
	}, []);

	return (
		<form className={ styles.galleryFooter } action={ addGalleryImage }>
			<input
				type='file'
				name='galleryImage'
				className={ styles.uploadGalleryFileInput }
				accept='.jpeg,.jpg,.png'
				onChange={ uploadImage }
				ref={ inputLink }
			/>
			<input type='hidden' name='uploader' value={ user } />
			<Button triggerUpload={ () => inputLink.current.click() } />
		</form>
	);
}

export default AddForm;