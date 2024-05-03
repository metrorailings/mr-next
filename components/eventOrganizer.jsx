'use client'

import React, { useState, useEffect } from 'react';

import { subscribe, unsubscribe } from 'lib/utils';

import PhotoViewer from 'components/photoViewer';
import ConfirmModal from 'components/confirmModal';
import InfoModal from 'components/infoModal';

const EventOrganizer = () => {

	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [openIndex, setOpenIndex] = useState(0);
	const [preventAccessToOriginal, setPreventAccessToOriginal] = useState(false);

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalMarkdown, setModalMarkdown] = useState('');
	const [ModalJSXButtons, setModalJSXButtons] = useState('');
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
	const openInfoModal = (event) => {
		setInfoModalOpen(true);
		openModal(event);
	}
	const openModal = (event) => {
		setModalText(event.detail.text);
		setModalMarkdown(event.detail.modalMarkdown);
		setModalBoldText(event.detail.boldText);
		setModalImage(event.detail.image);
		setPostModalFunc(() => event.detail.confirmFunction);

		if (event.detail.ModalJSXButtons) {
			setModalJSXButtons(() => event.detail.ModalJSXButtons);
		}
	}
	const closeModal = () => {
		setConfirmModalOpen(false);
		setInfoModalOpen(false);
		setModalText('');
		setModalMarkdown('');
		setModalBoldText('');
		setModalJSXButtons(null);
		setModalImage(null);
		setPostModalFunc(null);
	}

	useEffect(() => {
		subscribe('open-photo-viewer', openViewer);
		subscribe('open-info-modal', openInfoModal);
		subscribe('open-confirm-modal', openConfirmModal);

		return () => {
			unsubscribe('open-photo-viewer', openViewer);
			unsubscribe('open-info-modal', openInfoModal);
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

			{ infoModalOpen ? (
				<InfoModal modalMarkdown={ modalMarkdown } ModalJSXButtons={ ModalJSXButtons } closeFunc={ closeModal } />
			) : null }
		</>
	);
};

export default EventOrganizer;