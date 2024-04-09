import EventOrganizer from 'components/eventOrganizer';
import CustomToaster from 'components/customToaster';

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				{ children }

				<EventOrganizer />
				<CustomToaster />
			</body>
		</html>
	);
}