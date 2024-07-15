import Header from 'components/public/header';
import Footer from 'components/public/footer';
import EventOrganizer from 'components/eventOrganizer';
import CustomToaster from 'components/CustomToaster';

export default function Layout(props) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />

			<EventOrganizer />
			<CustomToaster />
		</>
	)
}