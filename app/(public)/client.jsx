'use client'

import React, { Suspense } from 'react';
import Image from 'next/image';

import styles from 'public/styles/page/home.module.scss';
import mLogo from 'assets/images/logos/m-logo.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars } from '@fortawesome/free-solid-svg-icons'

import VideoComponent from 'components/public/videoComponent';

import { textToParagraphs } from 'lib/utils';

const HomePage = ({ videoURLs, aboutMeText }) => {

	const videoLinks = JSON.parse(videoURLs);
	const aboutMeParagraphs = textToParagraphs(aboutMeText);

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
					<VideoComponent videos={ videoLinks } />
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
		</>
	);
};

export default HomePage;