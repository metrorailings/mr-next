import React, { useState } from 'react';

import { getUserSession } from 'lib/userInfo';

import styles from "public/styles/page/lib/file_module.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const FileUpload = ({ uploadUrl, orderId, existingFiles, lazyLoad, isShopUser }) => {

	const [media, setMedia] = useState([]);
	const [files, setFiles] = useState([]);

	const userProfile = getUserSession();

	const uploadFiles = () => {

	};

	for (let i = 0; i < existingFiles.length; i += 1) {
	}

	return (
		<>
			{ userProfile?.permissions?.uploadFile ? (
				<>
					<div className={ styles.file_upload_section }>
						<div className={ styles.file_upload_form }>
							<span className={ styles.label }>Upload a File?</span>
							<button className={ styles._upload_file_type }>Upload Media/File</button>
							<input type='file' className={ styles.file_upload_input } multiple />
						</div>

						<div className={ styles.file_uploading_indicators }>
							<span className={ styles.uploading_text }>Processing</span>
							<span className={ styles.loading_ball }></span>
							<span className={ styles.loading_ball }></span>
							<span className={ styles.loading_ball }></span>
						</div>
					</div>
				</>
			) : null }

			<div className={ styles.files_listing }>
				<div className={ styles.pictures_container }>
					<div className={ styles.upload_container_header }>
						{ translateToSpanish ? "Fotos" : "Pictures" }
					</div>
					{ !!(lazyLoad) === false ? (
						existingFiles.map((file, index) => {
							return (
								<div key={index}>
									
								</div>
							);
						})) : (
							translateToSpanish ? "Load All Pictures..." : "Cargar Todas Las Fotos..."
						)
					}
				</div>
			</div>

					<div class='drawingsContainer  {{#unless order.drawings.length}} hide {{/unless}}'>
					<div class='uploadContainerHeader'>
				{{#unless translateToSpanish}}
					Drawings
				{{else}}
					Dibujos
				{{/unless}}
					</div>
				{{#unless doNotLoadOnInit}}
				{{#each order.drawings}}
				{{> fileThumbnail showDeleteIcon=true}}
				{{/each}}
				{{/unless}}

				{{#if doNotLoadOnInit}}
				{{#if order.drawings.length}}
					<div class='loadDrawingsLink' data-order-id='{{ order._id }}'>
				{{#unless translateToSpanish}}
					Load All Drawings...
				{{else}}
					Cargar Todos Los Dibujos...
				{{/unless}}
					</div>
				{{/if}}
				{{/if}}
					</div>

					<div class='filesContainer  {{#unless order.files.length}} hide {{/unless}}'>
					<div class='uploadContainerHeader'>
				{{#unless translateToSpanish}}
					Files
				{{else}}
					Archivos
				{{/unless}}
					</div>
				{{#unless doNotLoadOnInit}}
				{{#each order.files}}
				{{> fileThumbnail showDeleteIcon=true}}
				{{/each}}
				{{/unless}}

				{{#if doNotLoadOnInit}}
				{{#if order.files.length}}
					<div class='loadFilesLink' data-order-id='{{ order._id }}'>
				{{#unless translateToSpanish}}
					Load All Files...
				{{else}}
					Cargar Todos Los Archivos...
				{{/unless}}
					</div>
				{{/if}}
				{{/if}}
					</div>

					<a class='downloadLink' href='' download=''></a>
					</div>
		</>
	);
};

export default FileUpload;