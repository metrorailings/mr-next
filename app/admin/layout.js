import EventOrganizer from 'components/eventOrganizer';
import { Toaster } from 'react-hot-toast';

import styles from 'public/styles/page/components.module.scss';

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				{ children }

				<EventOrganizer />
				<Toaster
					toastOptions={ {
						className: styles.generalToast,

						iconTheme: {
							primary: styles.toastIconGeneralPrimary,
							secondary: styles.toastIconGeneralSecondary,
						},

						success: {
							className: styles.successToast,
							duration: 4000,

							iconTheme: {
								primary: styles.toastIconGeneralPrimary,
								secondary: styles.toastIconSuccessSecondary
							},
						},
						error: {
							className: styles.errorToast,
							duration: 5000,

							iconTheme: {
								primary: styles.toastIconGeneralPrimary,
								secondary: styles.toastIconErrorSecondary
							},
						}
					} }
				/>
			</body>
		</html>
	);
}