import Image from 'next/image';

import LogInForm from 'app/(public)/login/LogInForm';

import styles from 'public/styles/page/logIn.module.scss';
import logo from 'assets/images/logos/white_logo_color_background.png';

const LoginServer = () => {

	return (
		<>
			<div className={ styles.pageContainer }>
				<div className={ styles.logoHeaderContainer }>
					<Image src={ logo } alt='Logo' className={ styles.logoHeader } priority/>
				</div>

				<h1 className={ styles.cSuiteHeader }>C-Suite</h1>

				<LogInForm />
			</div>
		</>
	);
};

export default LoginServer;