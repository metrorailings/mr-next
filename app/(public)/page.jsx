import { list } from '@vercel/blob'
import { readFileSync } from 'node:fs';

import HomePage from "app/(public)/client";

const HomeServer = async () => {

	// Grab the video to show on the home page
	const { blobs } = await list({
		token: process.env.BLOB_READ_WRITE_TOKEN,
		prefix: 'montage.webm',
		limit: 1,
	})

	// Grab the 'About Me' text as well
	const aboutMeText = readFileSync('assets/text/aboutUs.txt', { encoding: 'utf-8' });

	return (
		<>
			<HomePage
				videoURLs={ JSON.stringify(blobs) }
				aboutMeText={ aboutMeText }
			/>
		</>
	);
};

export default HomeServer;