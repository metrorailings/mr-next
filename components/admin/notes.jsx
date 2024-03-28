'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { NOTE_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

import NoteRecord from 'components/admin/noteRecord';

import styles from 'public/styles/page/notes.module.scss';

const NoteManager = ({ orderId, existingNotes, lazyLoad, inSpanish, users }) => {

	const [newNote, setNewNote] = useState({
		text: '',
		type: 'note',
		assignTo: '',
		orderId: orderId
	});
	const [notes, setNotes] = useState(existingNotes || []);
	const [notesLoaded, setNotesLoaded] = useState(lazyLoad);

	const updateNote = (event) => {
		setNewNote({
			...newNote,
			[event.currentTarget.name]: event.currentTarget.value
		});
	};

	const saveNote = async () => {
		toast.dismiss();

		try {
			const savedNote = await httpRequest(NOTE_API.NOTE, 'PUT', newNote);
			toast.success('A new note has been posted!');
			setNotes(notes.concat(savedNote.result));
		} catch (error) {
			console.error(error);
			toast.error('Please try saving the note again');
		}
	}

	const loadAllNotes = async () => {
		try {
			const loadedNotes = await httpRequest(NOTE_API.NOTE, 'GET');
			setNotes([...notes, ...loadedNotes]);
			setNotesLoaded(true);
		} catch (error) {
			console.error(error);
			toast.error('Something odd happened with the server. Please try again.');
		}
	};

	return (
		<>
			<div className={ styles.noteListing }>
				<textarea
					className={ styles.newNoteTextContainer }
					placeholder={ inSpanish ? 'Escribe una nueva nota aqui' : 'Write a new note here' }
					value={ newNote.text }
					name='text'
					onChange={ updateNote }
				/>

				<div className={ styles.newNoteActions }>
					<span className={ styles.notePropField }>
						<label className={ styles.notePropFieldLabel }>Type</label>
						<select
							className={ styles.notePropFieldInput }
							onChange={ updateNote }
							name='type'
							value={ newNote.type }
							disabled={ true }
						>
							<option value='note'>Note</option>
							<option value='task'>Task</option>
							<option value='shop'>Shop</option>
						</select>
					</span>

					<span className={ styles.notePropField }>
						<label className={ styles.notePropFieldLabel }>Assign To</label>
						<select
							className={ styles.notePropFieldInput }
							onChange={ updateNote }
							name='assignee'
							value={ newNote.assignee }
							disabled={ newNote.type !== 'task' }
						>
							{ users.map((username, index) => {
								return (
									<option key={ index } value={ username }>{ username }</option>
								);
							})}
						</select>
					</span>

					<span className={ styles.notePropField }>
						<button className={ styles.notePropFieldSubmitButton } type='button' onClick={ saveNote }>
							{ inSpanish ? 'Guardar Nota' : 'Save Note/Task' }
						</button>
					</span>
				</div>
			</div>

			{ notesLoaded ? (
				<div className={ styles.noteLazyLoadLink } onClick={ loadAllNotes }>
					{ inSpanish ? 'Cargar Todos Las Notas...' : 'Load All Notes' }
				</div>
			) : (
				<div className={ styles.noteRecordsContainer }>
					{ notes.map((note, index) => {
						return (
							<div className={ styles.noteRecord } key={ index }>
								<NoteRecord note={ note } inSpanish={ inSpanish } />
							</div>
						);
					})}
				</div>
			) }
		</>
	);
}

export default NoteManager;