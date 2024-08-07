import { resolve } from 'node:path';

import classNames from 'classnames';

import Header from 'components/public/Header';
import Footer from 'components/public/Footer';
import EventOrganizer from 'components/EventOrganizer';
import CustomToaster from 'components/CustomToaster';

import 'public/styles/foundation/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { RobotoMono, Poppins, Raleway, Comfortaa, AvenirLight, AvenirHeavy } from 'app/fonts';

export default function RootPublicLayout({ children }) {

	// We need to do this so that Vercel can read files on the fly from this directory in production
	resolve('./', 'assets/text');

	return (
		<html lang='en' className={ classNames({
			[RobotoMono.variable]: true,
			[Poppins.variable]: true,
			[Raleway.variable]: true,
			[Comfortaa.variable]: true,
			[AvenirHeavy.variable]: true,
			[AvenirLight.variable]: true
		})}>
			<body>
				<Header />
				{ children }
				<Footer />
	
				<EventOrganizer />
				<CustomToaster />
			</body>
		</html>
	);
}