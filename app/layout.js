import classNames from 'classnames';

import { RobotoMono, Poppins, Raleway, Comfortaa, AvenirLight, AvenirHeavy } from 'app/fonts';

import 'public/styles/foundation/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

export default function RootLayout({ children }) {
	return (
		<html lang='en' className={ classNames({
			[RobotoMono.variable]: true,
			[Poppins.variable]: true,
			[Raleway.variable]: true,
			[Comfortaa.variable]: true,
			[AvenirHeavy.variable]: true,
			[AvenirLight.variable]: true
		})}>
			<head>
				<title>Metro Railings</title>
			</head>
			<body>
				{ children }
			</body>
		</html>
	);
}