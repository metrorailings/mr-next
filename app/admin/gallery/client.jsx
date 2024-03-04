'use client'

import React, { useState, Suspense } from 'react';
import Image from 'next/image';

import styles from 'public/styles/page/gallery.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars } from '@fortawesome/free-solid-svg-icons'

const GalleryPage = ({ photos }) => {

	const [existingPhotos, setExistingPhotos] = useState(JSON.parse(photos));

	return (
		<>
		</>
	);
};

export default GalleryPage;