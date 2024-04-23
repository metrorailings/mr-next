'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { NOTE_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';
import { sortNotes } from 'lib/utils';

import NoteRecord from 'components/admin/noteRecord';

import { validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { toastValidationError } from 'components/customToaster';

import styles from 'public/styles/page/notes.module.scss';

const NoteManager = ({ orderId, existingNotes, lazyLoad, inSpanish, users }) => {

	const [newNote, setNewNote] = useState({
		text: '',
		assignee: '',
		type: 'note',
		assignTo: '',
		orderId: orderId || null
	});
	const [notes, setNotes] = useState(existingNotes || []);
	const [notesLoaded, setNotesLoaded] = useState(lazyLoad);

	// ---------- Validation functions
	const validateNoteText = () => validateEmpty(newNote.text);

	// ---------- Client-side error tests
	const newNoteValidationFields = [
		{ prop: newNote.text, validator: validateNoteText, errorMsg: 'A note/task is meaningless without any text.' }
	];

	const updateNote = (event) => {
		const prop = event.currentTarget.name;
		const value = event.currentTarget.value;

		let changedNote = {
			...newNote,
			[prop]: value
		};

		if (prop === 'type' && value !== 'task') {
			changedNote.assignTo = '';
		}

		setNewNote(changedNote);
	};

	const saveNote = async () => {
		const errors = runValidators(newNoteValidationFields);

		if (errors.length === 0) {

			// Save the new note and display a proper toast message in the process
			const noteType = (newNote.type === 'task' ? 'task' : 'note');
			const savedNote = await httpRequest(NOTE_API.NOTE, 'PUT', newNote, {
				loading: 'Adding a new ' + noteType + '..',
				success: 'A new ' + noteType + ' has been added.',
				error: 'Something went wrong when trying to register a new ' + noteType + '. Please try again.'
			});

			// Add the new note and make sure the note collection is properly sorted
			const allNotes = [...notes, savedNote.result];
			sortNotes(allNotes);
			setNotes(allNotes);

			// Clear out the textarea in the new note form as well
			setNewNote({
				...newNote,
				text: ''
			});
		} else {
			toastValidationError(errors);
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
							name='assignTo'
							value={ newNote.assignTo }
							disabled={ newNote.type !== 'task' }
						>
							<option value=''>Select a username...</option>
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
					{ notes.map((note) => {
						return (
							<NoteRecord note={ note } inSpanish={ inSpanish } key={ note._id }/>
						);
					})}
				</div>
			) }
		</>
	);
}

export default NoteManager;