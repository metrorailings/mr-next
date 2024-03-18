import { readFileSync } from 'node:fs';
import React, { Suspense } from 'react';
import { list } from '@vercel/blob'
import Image from 'next/image';

import GallerySection from 'app/(public)/gallery';
import ReviewsServer from 'app/(public)/reviewsServer';
import ReviewSkeleton from 'app/(public)/reviewSkeleton';
import VideoComponent from 'components/public/videoComponent';
import { textToParagraphs } from 'lib/utils';
import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/home.module.scss';
import mLogo from 'assets/images/logos/m-logo.png';

const HomeServer = async () => {

	// Grab the video to show on the home page
	const { blobs } = await list({
		token: process.env.BLOB_READ_WRITE_TOKEN,
		prefix: 'montage.webm',
		limit: 1
	});

	// Grab the 'About Me' text as well
	const aboutMeText = readFileSync('assets/text/aboutUs.txt', { encoding: 'utf-8' });
	const aboutMeParagraphs = textToParagraphs(aboutMeText);

	// Grab the initial pictures to show on the gallery section
	const galleryImages = await getGalleryImages();

	return (
		<>
			{ /* BANNER VIDEO */ }
			<div className={ styles.homeVideoContainer }>
				<div className={ styles.companyName }>
					<Image
						src={ mLogo }
						alt='M'
						width={ 128 }
						height={ 128 }
					/>
					<span>ETRO RAILINGS</span>
				</div>
				<Suspense fallback={ <p>Blahblahblah</p> }>
					<VideoComponent videos={ blobs } />
				</Suspense>
			</div>

			{ /* ABOUT US */ }
			<div className={ styles.aboutUsSection }>
				<div className={ styles.aboutUsSectionHeader }>ABOUT US</div>
				<div className={ styles.aboutUsText }>
					{ aboutMeParagraphs.map((paragraph, index) => {
						return (
							<p key={ index }>{ paragraph }</p>
						);
					})}
				</div>
			</div>

			{ /* GALLERY */ }
			<GallerySection jsonImages={ JSON.stringify(galleryImages) } />

			{ /* REVIEWS */ }
			<div className={ styles.reviewSection }>
				<div className={ styles.reviewSectionHeader }>CLIENT TESTIMONIALS</div>
				<Suspense fallback={ <ReviewSkeleton /> }>
					<ReviewsServer />
				</Suspense>
			</div>
		</>
	);
};

export default HomeServer;