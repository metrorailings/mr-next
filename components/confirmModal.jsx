import React, { useState, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';

import styles from "public/styles/page/components.module.scss";
import classNames from 'classnames/bind';

import { subscribe, unsubscribe } from 'lib/utils';

const ConfirmModal = () => {

	const [doShow, setDoShow] = useState(false);
	const [text, setText] = useState('');
	const [image, setImage] = useState(null);
	const [confirmFunction, setConfirmFunction] = useState(null);

	const boundStyles = classNames.bind(styles);

	const showModal = (event) => {
		setDoShow(true);
		setText(event.detail.text);
		setImage(event.detail.image);
		setConfirmFunction(event.detail.confirmFunction)
	}

	const confirm = () => {
		confirmFunction();
	};
	const cancel = () => {
	};

	useEffect(() => {
		subscribe('open-confirm-modal', showModal);

		return () => {
			unsubscribe('open-confirm-modal', showModal);
		}
	}, []);

	useLayoutEffect(() => {

	}, [doShow]);

	if (doShow) {
		return (
			<div className={ styles.test }>
				<div className={ styles.test }>
					<div className={ styles.test }>
						{ image ? (
							<Image
								src={ image.url }
								alt={ image.pathname }
								height={ 150 }
							/>
						) : null }
						<div className={ styles.test }>{ text }</div>
					</div>
					<div className={ styles.test }>
						<button type='button' onClick={ confirm }>Yes</button>
						<button type='button' onClick={ cancel }>Cancel</button>
					</div>
				</div>
			</div>
		);
	} else {
		return (<></>);
	}
};

export default ConfirmModal;