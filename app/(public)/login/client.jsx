'use client'

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import MRToaster, { toastValidationError } from "components/customToaster";

import styles from "public/styles/page/logIn.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons'
import logo from "assets/images/logos/white_logo_color_background.png";

import { validateCredentials } from 'lib/validators/inputValidators';
import { storeUserSession } from 'lib/userInfo';
import { AUTH_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

const LoginPage = () => {
	const [showPasswordFlag, setShowPasswordFlag] = useState(false);
	const [rememberMeFlag, setRememberMeFlag] = useState(false);
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	useEffect(() => {
	}, []);

	const handleCredentialUpdate = (event) => {

		let newCredentials = {
			...credentials,
			[event.currentTarget.name]: event.currentTarget.value
		};
		setCredentials(newCredentials);
	};

	const handleSubmit = async () => {

		// Dismiss any lingering toasts
		toast.dismiss();

		// Relay any errors should the form not be ready for submission
		const errors = [];
		if (!(credentials.username)) {
			errors.push("Please type in a username.");
		} else if (validateCredentials(credentials.username, '-_.', 1, 15) === false) {
			errors.push("Enter a valid username. Follow the rules specified under the username field.");
		}
		if (!(credentials.password)) {
			errors.push("Please type in a password.");
		} else if (credentials.password.length < 6) {
			errors.push("The password should consist of at least 6 characters.");
		}

		if (errors.length === 0) {
			try {
				const response = await httpRequest(AUTH_API.POST_LOG_IN, 'POST', credentials);
				storeUserSession(response);

				// Move to the dashboard page
				// @TODO - Include logic here to navigate to an admin page
			} catch (err) {
				console.error(err);
			}
		} else {
			toastValidationError(errors);
		}
	};


	return (
		<>
			<div id={styles.page_container}>
				<div className={styles.logo_header_container}>
					<Image src={logo} alt="Logo" className={styles.logo_header} priority></Image>
				</div>

				<h1 className={styles.c_suite_header}>C-Suite</h1>

				<div id={styles.login_box}>
					<form>
						<div id={styles.login_box_body}>
							<label className={styles.label}>User Name</label>
							<div className={styles.input_grouping}>
								<span className={styles.input_grouping_icon}>
									<FontAwesomeIcon icon={faUser} />
								</span>
								<input
									type='text'
									name='username'
									className={styles.input_control}
									placeholder='Enter your user name or e-mail address...'
									onChange={handleCredentialUpdate}
									autoComplete='username'
								/>
							</div>

							<label className={styles.label}>Password</label>
							<div className={styles.input_grouping}>
								<span className={styles.input_grouping_icon}>
									<FontAwesomeIcon icon={faKey} />
								</span>
								<input
									type={showPasswordFlag ? 'text' : 'password'}
									name='password'
									className={styles.input_control}
									placeholder='Enter your password here...'
									onChange={handleCredentialUpdate}
									autoComplete='current-password'
								/>
								<span className={styles.input_grouping_icon}>
									<FontAwesomeIcon
										icon={showPasswordFlag ? faEye : faEyeSlash}
										onClick={() => { setShowPasswordFlag(!showPasswordFlag) }}
									/>
								</span>
							</div>

							<div id={styles.remember_me}>
								<input
									type='checkbox'
									id='rememberMe'
									className={styles.input_checkbox}
									checked={rememberMeFlag}
									readOnly
								/>
								<label
									htmlFor='rememberMe'
									className={styles.secondary_label}
									onClick={() => { setRememberMeFlag(!rememberMeFlag) }}
								>
									Remember Me
								</label>
							</div>

						</div>

						<div>
							<button className={styles.button_primary} onClick={handleSubmit} type="button">
								Submit
							</button>
						</div>

					</form>
				</div>

				<MRToaster />
			</div>
		</>
	);
};

export default LoginPage;