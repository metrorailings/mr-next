import "public/styles/foundation/global.scss";
import 'react-loading-skeleton/dist/skeleton.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'react-tooltip/dist/react-tooltip.css'

export default function RootLayout({ children }) {

	return (
		<html lang="en">
			<head>
				<title>Metro Railings</title>
				<meta name="description" content='The greatest railing company in New Jersey'/>
				<link rel='icon' href='/favicon.ico'/>
			</head>
			<body>
				{ children }
			</body>
		</html>
	);
}