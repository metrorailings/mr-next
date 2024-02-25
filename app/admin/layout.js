import PhotoViewer from 'components/photoViewer';

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>
				{ children }
				<PhotoViewer />
			</body>
		</html>
	);
}