import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import styles from 'public/styles/page/lib/components.module.scss';

export function SubLoader() {
	return ( <FontAwesomeIcon icon={ faSpinner } /> );
}

export function UploadingLoader() {
	return (
		<>
			<div className={ styles.uploading_indicators }>
				<span className={ styles.section_loading_text }>Processing</span>
				<span className={ styles.loading_ball }></span>
				<span className={ styles.loading_ball }></span>
				<span className={ styles.loading_ball }></span>
			</div>
		</>
	);
}