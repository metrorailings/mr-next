'use client'

import React, { useState, useEffect } from 'react';

import { subscribe, unsubscribe } from 'lib/utils';

import PhotoViewer from 'components/photoViewer';
import ConfirmModal from 'components/confirmModal';

const EventOrganizer = () => {

	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [openIndex, setOpenIndex] = useState(0);
	const [preventAccessToOriginal, setPreventAccessToOriginal] = useState(false);

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalBoldText, setModalBoldText] = useState('');
	const [modalImage, setModalImage] = useState(null);
	const [postModalFunc, setPostModalFunc] = useState(null);

	const openViewer = (event) => {
		setPhotoViewerOpen(true);
		setPhotos(event.detail.photos);
		setOpenIndex(event.detail.currentIndex);
		setPreventAccessToOriginal(event.detail.preventAccessToOriginal || false);
	}
	const closeViewer = () => {
		setPhotoViewerOpen(false);
		setPhotos([]);
		setOpenIndex(0);
		setPreventAccessToOriginal(false);
	}

	const openConfirmModal = (event) => {
		setConfirmModalOpen(true);
		openModal(event);
	}
	const openModal = (event) => {
		setModalText(event.detail.text);
		setModalBoldText(event.detail.boldText);
		setModalImage(event.detail.image);
		setPostModalFunc(() => event.detail.confirmFunction);
	}
	const closeModal = () => {
		setConfirmModalOpen(false);
		setModalText('');
		setModalImage(null);
		setPostModalFunc(null);
	}

	useEffect(() => {
		subscribe('open-photo-viewer', openViewer);
		subscribe('open-confirm-modal', openConfirmModal);

		return () => {
			unsubscribe('open-photo-viewer', openViewer);
			unsubscribe('open-confirm-modal', openConfirmModal);
		}
	});

	return (
		<>
			{ photoViewerOpen ? (
				<PhotoViewer photos={ photos } currentIndex={ openIndex } preventAccessToOriginal={ preventAccessToOriginal || false } closeFunc={ closeViewer } />
			) : null }

			{ confirmModalOpen ? (
				<ConfirmModal text={ modalText } boldText={ modalBoldText } image={ modalImage } confirmFunc={ postModalFunc } closeFunc={ closeModal } />
			) : null }
		</>
	);
};

export default EventOrganizer;