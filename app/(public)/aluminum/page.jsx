import { readFileSync } from 'node:fs';
import Image from 'next/image';

import { getGalleryImages } from 'lib/http/galleryDAO';

import Galleria from 'components/galleria';

import styles from 'public/styles/page/productPage.module.scss';

const AluminumProductServer = async () => {

	const galleryPhotos = await getGalleryImages('aluminum');

	return (
		<div className={ styles.pageContainer }>

			<div className={ styles.galleriaTitle }>Aluminum Gallery</div>
			<Galleria jsonImages={ JSON.stringify(galleryPhotos) } isPublic={ true }/>
		</div>
	);
};

export default AluminumProductServer;