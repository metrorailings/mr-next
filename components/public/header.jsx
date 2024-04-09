'use client'

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "public/styles/page/headerFooter.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import logo from "assets/images/logos/color_logo_transparent_background_small.png";

export default function Header() {

	const mobileMenu = useRef(null);

	const toggleMobileMenu = () => {
		mobileMenu.current.style.height = mobileMenu.current.style.height || '0px';
		if (window.parseInt(mobileMenu.current.style.height, 10)) {
			mobileMenu.current.style.height = '0px';
		} else {
			mobileMenu.current.style.height = mobileMenu.current.scrollHeight + 'px';
		}
	};

	return (
		<>
			<header className={ styles.topMenu }>
			<span className={ styles.topMenuLogoContainer }>
				<Image
					src={ logo }
					alt="Logo"
					fill={ true }
					sizes="(max-width: 768px) 33vw, 25vw"
				/>
			</span>

			<span className={ styles.desktopMenuLinks }>
				<Link href='/contact-us' className={ styles.topMenuLink }>CONTACT US</Link>
				<Link href='/faqs' className={ styles.topMenuLink }>FAQS</Link>				
				<Link href='/gallery' prefetch={ true } className={ styles.topMenuLink }>GALLERY</Link>
			</span>

			<span className={ styles.topMenuExpander } onClick={ toggleMobileMenu }>
				<FontAwesomeIcon icon={ faBars }/>
				MENU
			</span>

				<span className={ styles.mobileMenuLinks } ref={ mobileMenu }>
				<Link href='/contact-us' className={ styles.topMenuLink }>CONTACT US</Link>				
				<Link href='/faqs' className={ styles.topMenuLink }>FAQS</Link>				
				<Link href='/gallery' prefetch={ true } className={ styles.topMenuLink }>GALLERY</Link>
			</span>

			</header>
			<div className={ styles.topMenuSpace }></div>
		</>
	);
}