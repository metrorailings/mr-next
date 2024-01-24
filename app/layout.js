import "public/styles/foundation/global.scss";
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function RootLayout({ children }) {

	return (
		<html lang="en">
			<head></head>
			<body>
				{children}
			</body>
		</html>
	);
}