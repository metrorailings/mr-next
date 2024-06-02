import EventOrganizer from 'components/eventOrganizer';
import CustomToaster from 'components/customToaster';

// @TODO - Beautify the admin system on mobile sometime in the far future
export const viewport = {
	width: '1201',
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<title>Metro Railings Admin Platform</title>
			</head>
			<body>
				{ children }
		
				<EventOrganizer/>
				<CustomToaster/>
			</body>
		</html>
	);
}