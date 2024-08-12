import ContactUsForm from 'app/(public)/contact-us/form';

import styles from 'public/styles/page/contactUs.module.scss';

export const metadata = {
	title: 'Contact Us',
	description: 'Reach out to us here',
	robots: {
		index: true,
		follow: true
	}
};

const ContactUsServer = () => {
	return (
		<>
			<h3 className={ styles.pageHeader }>CONTACT US</h3>
			<ContactUsForm />
		</>
	);
};

export default ContactUsServer;