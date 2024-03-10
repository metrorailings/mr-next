import EventOrganizer from 'components/eventOrganizer';

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				{ children }
				<EventOrganizer />
			</body>
		</html>
	);
}