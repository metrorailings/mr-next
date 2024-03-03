import Header from 'components/public/header';
import Footer from 'components/public/footer';

export default function Layout(props) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />
		</>
	)
}