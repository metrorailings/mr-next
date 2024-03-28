'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from "dayjs";

import { NOTE_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';
import { getUserSession } from 'lib/userInfo';

import styles from 'public/styles/page/notes.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const NoteRecord = ({ note, inSpanish }) => {

	const [noteStatus, setNoteStatus] = useState(note.status);

	const updateStatus = async (newStatus) => {
		setNoteStatus(newStatus);

		// Dismiss any lingering toasts
		toast.dismiss();

		// Note the status update in the back-end
		await httpRequest(NOTE_API.NOTE, 'POST', {
			noteId: note._id,
			noteData: {
				status: newStatus,
				closer: getUserSession().username
			},
		});
	};

	return (
		<>
			{ /* Metadata */ }
			<span>
				{ (!!(inSpanish) === false && note.type !== 'note') ? (
					<span className={ styles.noteCellSpecialHeader }>{ note.type.toUpperCase() }</span>
				) : null }
	
				<span className={ styles.noteMetadataCell }>
					<div className={ styles.noteDateSubcell }>
						{ dayjs(note.dates?.created).format('MMM DD, YYYY') }
					</div>
					<div className={ styles.noteDateSubcell }>
						{ dayjs(note.dates?.created).format('hh:mm A') }
					</div>
					<div className={ styles.noteAuthorSubcell }>{ note.author }</div>
				</span>
			</span>

			{ /* Text */ }
			<span className={ styles.noteTextCell }>{ note.text }</span>

			{ /* Task Status */ }
			{ note.type === 'task' ? (
				<span className={ styles.taskMetadataCell }>
					{ noteStatus === 'open' ? (
						<>
							<div className={ styles.taskStatusSubcell }>OPEN</div>
							<div className={ styles.taskOwnersSubcell }>
								Assigned to: <br/>{ note.assignTo }
							</div>
						</>
					) : null }
					{ noteStatus === 'resolved' ? (
						<div className={ styles.taskOwnersSubcell }>Resolved by <br />{ note.closer }</div>
					) : null }
					{ noteStatus === 'cancelled' ? (
						<div className={ styles.taskOwnersSubcell }>Cancelled by <br />{ note.closer }</div>
					) : null }
				</span>
			) : null }
	
			{ /* Task Actions */ }
			{ (note.type === 'task' && noteStatus === 'open') ? (
				<span className={ styles.taskActions }>
					<FontAwesomeIcon
						icon={ faCheckCircle }
						className={ styles.taskResolveIcon }
						onClick={ () => updateStatus('resolved') }
					/>
					<FontAwesomeIcon
						icon={ faTimesCircle }
						className={ styles.taskCancelIcon }
						onClick={ () => updateStatus('cancelled') }
					/>
				</span>
			) : null }
		</>
	);
}

export default NoteRecord;
