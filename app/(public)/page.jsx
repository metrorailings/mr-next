import Link from 'next/link';

export default function Page() {

	return (
		<>
			<h1>Hello, Home Page!</h1>
			<Link href='/dashboard'>Dashboard</Link>
		</>
	);
}