import EventOrganizer from 'components/eventOrganizer';
import CustomToaster from 'components/customToaster';

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<title>Metro Railings Admin Platform</title>
				<meta name='viewport' content='width=device-width, width=1201' />
			</head>
			<body>
				{ children }
		
				<EventOrganizer/>
				<CustomToaster/>
			</body>
		</html>
	);
}