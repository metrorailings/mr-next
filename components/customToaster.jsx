'use client'

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import classNames from 'classnames';

import componentStyles from "public/styles/page/components.module.scss";

const MRToaster = () => {

	useEffect(() => {
	}, []);

	return (
		<>
			<Toaster
				toastOptions={{
					className: componentStyles.generalToast,

					iconTheme: {
						primary: componentStyles.toastIconGeneralPrimary,
						secondary: componentStyles.toastIconGeneralSecondary,
					},

					success: {
						className: componentStyles.successToast,
						duration: 6500,

						iconTheme: {
							primary: componentStyles.toastIconGeneralPrimary,
							secondary: componentStyles.toastIconSuccessSecondary
						},
					},

					error: {
						className: componentStyles.errorToast,
						duration: 10000,

						iconTheme: {
							primary: componentStyles.toastIconGeneralPrimary,
							secondary: componentStyles.toastIconErrorSecondary
						},
					}
				}}
				onClick={ (event) => event.preventDefault() }
			/>
		</>
	);
};

export default MRToaster;

/**
 * Function meant to gracefully relays validation errors through Toasts
 *
 * @param errors - an array of error messages
 *
 * @author kinsho
 */
export function toastValidationError(errors = []) {
	toast((t) => {
		return (
			<div>
				<div className={ componentStyles.customErrorToastBody }>
					Some things need to be fixed with the stuff you typed in the fields above.
					<ul className={ componentStyles.customErrorToastValidationErrorList }>
						{ errors.map((error, index) => {
							return (
								<li key={ index }>{ error }</li>
							);
						}) }
					</ul>
				</div>
				<div className={ componentStyles.customErrorToastCloseRow } onClick={ () => toast.dismiss(t.id) }>
					Close This Alert
				</div>
			</div>
		)},
		{
			id: 'custom-error-toast',
			duration: 50000,
			position: 'bottom-center'
		}
	);
}