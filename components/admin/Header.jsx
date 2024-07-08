'use client'

import { useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { clearUserSession } from 'lib/userInfo';
import { AUTH_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

import styles from "public/styles/page/headerFooter.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import logo from "assets/images/logos/color_logo_transparent_background_small.png";

export default function Header() {

	const mobileMenu = useRef(null);

	const router = useRouter();

	const toggleMobileMenu = (event) => {
		event.stopPropagation();

		mobileMenu.current.style.height = mobileMenu.current.style.height || '0px';
		if (window.parseInt(mobileMenu.current.style.height, 10)) {
			mobileMenu.current.style.height = '0px';
		} else {
			mobileMenu.current.style.height = mobileMenu.current.scrollHeight + 'px';
		}
	};

	const closeMobileMenu = () => {
		mobileMenu.current.style.height = '0px';
	}

	const logOut = async () => {
		try {
			await httpRequest(AUTH_API.AUTHORIZE, 'DELETE', {}, {
				loading: 'Logging out...',
				success: 'You are logged out. Taking you back to the main site now...',
				error: 'There was an issue logging you out. Try again.'
			});
			clearUserSession();

			// Move back to the log in page
			window.setTimeout(() => {
				// Make sure to dismiss any lingering toasts before navigating to other pages
				toast.dismiss();
				router.push('login');
			},1500);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<>
			<header className={ styles.topMenu } onClick={ closeMobileMenu }>

				<span className={ styles.topMenuLogoContainer }>
					<Image
						src={ logo }
						alt="Logo"
						fill={ true }
						sizes="(max-width: 768px) 33vw, 25vw"
					/>
				</span>

				<span className={ styles.desktopMenuLinks }>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/dashboard' className={ styles.topMenuLink }>DASHBOARD</Link>
					</span>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/order-search' className={ styles.topMenuLink }>ORDERS</Link>
					</span>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/gallery' className={ styles.topMenuLink }>GALLERY</Link>
					</span>
				</span>

				<span className={ styles.desktopIconList }>
					<FontAwesomeIcon icon={ faPowerOff } onClick={ logOut } className={ styles.topMenuLink }/>
				</span>

				<span className={ styles.topMenuExpander } onClick={ toggleMobileMenu }>
					<FontAwesomeIcon icon={ faBars }/>
					MENU
				</span>

				<span className={ styles.mobileMenuLinks } ref={ mobileMenu }>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/dashboard' className={ styles.topMenuLink }>DASHBOARD</Link>
					</span>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/order-search' className={ styles.topMenuLink }>ORDERS</Link>
					</span>
					<span className={ styles.topMenuLinkSlot }>
						<Link href='/admin/gallery' className={ styles.topMenuLink }>GALLERY</Link>
					</span>
				</span>

			</header>
			<div className={ styles.topMenuSpace }></div>
		</>
	);
}