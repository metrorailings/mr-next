import React from "react";
import toast, { Toaster } from "react-hot-toast";

import componentStyles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'

const MRToaster = () => {

	return (
		<>
			<Toaster
				position="bottom-center"
				toastOptions={{

					style: {
						fontFamily: componentStyles.toastFont,
						width: "200px"
					},

					error: {
						duration: 12000,
						style: {
							backgroundColor: componentStyles.errorColor,
							color: componentStyles.whiteColor
						}
					}
				}}
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

	const errorList = errors.map((error, index) =>
		<li key={index}>{error}</li>
	);

	toast.custom(
		<>
			<div className={componentStyles.custom_error_toast}>
				<div className={componentStyles.close_icon}>
					<FontAwesomeIcon icon={faXmark} />
				</div>
				<div className={componentStyles.error_icon}>
					<FontAwesomeIcon icon={faCircleExclamation} />
				</div>
				<div className={componentStyles.custom_error_body}>
					<div className={componentStyles.validation_errors_opener}>
						Some things need to be fixed with the stuff you typed in the fields above.
					</div>
					<ul className={componentStyles.validation_error_list}>
						{errorList}
					</ul>
				</div>
			</div>
		</>,
		{
			duration: 80000
		}
	);
}