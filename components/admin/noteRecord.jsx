'use client'

import React, { useState } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { NOTE_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';
import { getUserSession } from 'lib/userInfo';

import styles from 'public/styles/page/notes.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const NoteRecord = ({ note }) => {

	const [noteStatus, setNoteStatus] = useState(note.status || '');
	const [noteCloser, setNoteCloser] = useState(note.closer || '');

	const updateStatus = async (newStatus) => {
		const username = getUserSession().username;

		// Note the status update in the back-end
		try {
			await httpRequest(NOTE_API.NOTE, 'POST', {
				noteId: note._id,
				noteData: {
					status: newStatus,
					closer: username
				}
			});

			// Update the local copy of the note where necessary
			setNoteStatus(newStatus);
			setNoteCloser(username);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={ classNames({
			[styles.noteRecordPlain]: (note.type === 'note'),
			[styles.noteRecordTaskOpen]: (note.type === 'task' && noteStatus === 'open'),
			[styles.noteRecordTaskClosed]: (note.type === 'task' && (noteStatus === 'resolved' || noteStatus ==='cancelled'))
		})}>
			{ (note.type !== 'note') ? (
				<span className={ styles.noteCellSpecialHeader }>
					<span className={ styles.noteCellSpecialHeaderText }>{ note.type.toUpperCase() }</span>
				</span>
			) : (
				<span />
			) }

			{ /* Metadata */ }
			<span className={ styles.noteMetadataCell }>
				<div className={ styles.noteDateSubcell }>
					{ dayjs(note.dates?.created).format('MMM DD, YYYY') }
				</div>
				<div className={ styles.noteDateSubcell }>
					{ dayjs(note.dates?.created).format('hh:mm A') }
				</div>
				<div className={ styles.noteAuthorSubcell }>{ note.author }</div>
			</span>

			{ /* Text */ }
			<span
				className={ styles.noteTextCell }
				dangerouslySetInnerHTML={{ __html: note.text }}
			/>

			{ /* Task Status */ }
			{ note.type === 'task' ? (
				<span className={ styles.taskMetadataCell }>
					{ noteStatus === 'open' ? (
						<>
							<div className={ styles.taskStatusSubcellOpen }>OPEN</div>
							<div className={ styles.taskOwnersSubcell }>
								{ note.assignTo ? (
									<>
										Assigned to: <br/>{ note.assignTo }
									</>
								) : 'UNASSIGNED' }
							</div>
						</>
					) : null }
					{ noteStatus === 'resolved' ? (
						<>
							<div className={ styles.taskStatusSubcellResolved }>RESOLVED</div>
							<div className={ styles.taskOwnersSubcell }>Closed by <br/>{ noteCloser }</div>
						</>
					) : null }
					{ noteStatus === 'cancelled' ? (
						<>
							<div className={ styles.taskStatusSubcellCancelled }>CANCELLED</div>
							<div className={ styles.taskOwnersSubcell }>Closed by <br/>{ noteCloser }</div>
						</>
					) : null }
				</span>
			) : null }

			{ /* Task Actions */ }
			{ (note.type === 'task' && noteStatus === 'open') ? (
				<span className={ styles.taskActions }>
					<FontAwesomeIcon
						icon={ faCheckCircle }
						className={ styles.taskIconResolved }
						onClick={ () => updateStatus('resolved') }
					/>
					<FontAwesomeIcon
						icon={ faTimesCircle }
						className={ styles.taskIconCancelled }
						onClick={ () => updateStatus('cancelled') }
					/>
				</span>
			) : null }
		</div>
	);
}

export default NoteRecord;
