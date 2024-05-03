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
			<div className={ styles.pageContainer }>
				<div className={ styles.logoHeaderContainer }>
					<Image src={ logo } alt="Logo" className={ styles.logoHeader } priority />
				</div>

				<h1 className={ styles.cSuiteHeader }>C-Suite</h1>

				<div className={ styles.loginBox }>
					<form>
						<div className={ styles.loginBoxBody }>

							<label className={ styles.loginBoxLabel }>User Name</label>
							<div className={ styles.loginInputGrouping }>
								<span className={ styles.loginInputGroupingIcon }>
									<FontAwesomeIcon icon={faUser} />
								</span>
								<input
									type='text'
									name='username'
									className={ styles.loginInputField }
									placeholder='Enter your user name or e-mail address...'
									onChange={ handleCredentialUpdate }
									autoComplete='username'
								/>
							</div>

							<label className={ styles.loginBoxLabel }>Password</label>
							<div className={ styles.loginInputGrouping }>
								<span className={ styles.loginInputGroupingIcon }>
									<FontAwesomeIcon icon={ faKey } />
								</span>
								<input
									type={ showPasswordFlag ? 'text' : 'password' }
									name='password'
									className={ styles.loginInputField }
									placeholder='Enter your password here...'
									onChange={ handleCredentialUpdate }
									autoComplete='current-password'
								/>
								<span className={ styles.loginInputGroupingIcon }>
									<FontAwesomeIcon
										icon={showPasswordFlag ? faEye : faEyeSlash}
										onClick={() => { setShowPasswordFlag(!showPasswordFlag) }}
									/>
								</span>
							</div>

							<div className={ styles.rememberMe }>
								<input
									type='checkbox'
									id='rememberMe'
									className={ styles.loginCheckbox }
									checked={ rememberMeFlag }
									readOnly
								/>
								<label
									htmlFor='rememberMe'
									className={ styles.secondaryLabel }
									onClick={() => setRememberMeFlag(!rememberMeFlag) }
								>
									Remember Me
								</label>
							</div>

						</div>

						<div>
							<button className={ styles.buttonPrimary } onClick={ handleSubmit } type='button'>
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