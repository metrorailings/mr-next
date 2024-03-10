'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import styles from "public/styles/page/components.module.scss";

import { subscribe, unsubscribe } from 'lib/utils';

const ConfirmModal = () => {

	const [doShow, setDoShow] = useState(false);
	const [toRemove, setToRemove] = useState(false);
	const [text, setText] = useState('');
	const [image, setImage] = useState(null);
	const [confirmFunction, setConfirmFunction] = useState(null);

	const overlayElement = useRef(null);
	const modalContainerElement = useRef(null);

	const showModal = (event) => {
		setDoShow(true);
		setText(event.detail.text);
		setImage(event.detail.image);
		setConfirmFunction(event.detail.confirmFunction)
	};

	const closeModal = () => {
		setToRemove(true);
	};

	const closeModalAfterAnimation = () => {
		// Only execute this logic when we're closing out this modal
		if (toRemove) {
			setToRemove(false);
			setDoShow(false);
			setText('');
			setImage(null);
			setConfirmFunction(null);
		}
	};

	const confirm = (event) => {
		event.preventDefault();

		confirmFunction();
		closeModal();
	};

	const cancel = (event) => {
		event.preventDefault();

		closeModal();
	};

	useEffect(() => {
		subscribe('open-confirm-modal', showModal);

		window.setTimeout(() => {
			if (doShow) {
				overlayElement.current.style.backgroundColor = 'rgba(0 0 0 / 80%)';
			}
		}, 100);

		return () => {
			unsubscribe('open-confirm-modal', showModal);
		}
	}, [doShow]);

	if (doShow) {
		return (
			<div className={ styles.modalOverlay } onClick={ closeModal } ref={ overlayElement } onAnimationEnd={ closeModalAfterAnimation }>
				<div className={ styles.modalContainer }>
					<div className={ styles.modal } ref={ modalContainerElement }>
						<div className={ styles.modalBody }>
							{ image ? (
								<Image
									src={ image.url }
									alt={ image.pathname }
									height={ 150 }
									width={ 150 }
								/>
							) : null }
							<div className={ styles.modalBodyText }>{ text }</div>
						</div>
						<div className={ styles.modalButtonRow }>
							<button type='button' onClick={ confirm } className={ styles.modalConfirmButton }>Yes</button>
							<button type='button' onClick={ cancel } className={ styles.modalCancelButton }>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	} else
	{
		return (<></>);
	}
};

export default ConfirmModal;