import { readFileSync } from 'node:fs';
import Image from 'next/image';

import { getGalleryImages } from 'lib/http/galleryDAO';

import Galleria from 'components/Galleria';

import styles from 'public/styles/page/productPage.module.scss';
import aluminumBanner from 'assets/images/products/aluminum/aluminum-banner.jpg';
import horizontalRailing from 'assets/images/products/aluminum/aluminum-horizontal.jpeg';
import sunRailing from 'assets/images/products/aluminum/aluminum-railing-in-the-sun.jpg';
import deckRailing from 'assets/images/products/aluminum/deck-railing-1.jpeg';
import exoticRailing from 'assets/images/products/aluminum/exotic-railing-1.jpeg';

const AluminumProductServer = async () => {

	const introText = readFileSync('assets/text/aluminum/intro.txt', { encoding: 'utf-8' });
	const customizationText = readFileSync('assets/text/aluminum/customization.txt', { encoding: 'utf-8' });
	const looksText = readFileSync('assets/text/aluminum/looks.txt', { encoding: 'utf-8' });

	const galleryPhotos = await getGalleryImages('aluminum');

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.productBanner }>
				<Image
					src={ aluminumBanner }
					alt='Aluminum railing signature'
					fill={ true }
					sizes="100vw"
					className={ styles.productBannerImage }
				/>
				<span className={ styles.productBannerName }>Aluminum Railings</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ horizontalRailing }
						alt='Horizontal railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 50vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockText }>{ introText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ sunRailing }
						alt='Aluminum railing for deck'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 50vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ looksText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ deckRailing }
						alt='Aluminum railing for deck'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 50vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ exoticRailing }
						alt='Exotic railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 50vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockTextAlignLeft }>{ customizationText }</p>
			</div>

			<div className={ styles.galleriaTitle }>Aluminum Gallery</div>
			<Galleria jsonImages={ JSON.stringify(galleryPhotos) } isPublic={ true }/>
		</div>
	);
};

export default AluminumProductServer;