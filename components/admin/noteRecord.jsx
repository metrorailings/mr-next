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

	const [noteStatus, setNoteStatus] = useState(note.status);

	const updateStatus = async (newStatus) => {
		setNoteStatus(newStatus);

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
		<div className={ classNames({
			[styles.noteRecordPlain]: (note.type === 'note'),
			[styles.noteRecordTaskOpen]: (note.type === 'task' && note.status === 'open'),
			[styles.noteRecordTaskClosed]: (note.type === 'task' && (note.status === 'resolved' || note.status ==='cancelled'))
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
							<div className={ styles.taskOwnersSubcell }>Assigned to: <br/>{ note.assignTo }</div>
						</>
					) : null }
					{ noteStatus === 'resolved' ? (
						<>
							<div className={ styles.taskStatusSubcellResolved }>RESOLVED</div>
							<div className={ styles.taskOwnersSubcell }>Closed by <br/>{ note.closer }</div>
						</>
					) : null }
					{ noteStatus === 'cancelled' ? (
						<>
							<div className={ styles.taskStatusSubcellCancelled }>CANCELLED</div>
							<div className={ styles.taskOwnersSubcell }>Closed by <br/>{ note.closer }</div>
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
