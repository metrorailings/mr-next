import Header from 'components/public/header';
import Footer from 'components/public/footer';
import EventOrganizer from 'components/eventOrganizer';
import MRToaster from 'components/customToaster';

export default function Layout(props) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />

			<EventOrganizer />
			<MRToaster />
		</>
	)
}