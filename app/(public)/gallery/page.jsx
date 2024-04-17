import Galleria from 'components/galleria';

import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/gallery.module.scss';

const PublicGalleryServer = async () => {
	const galleryImages = await getGalleryImages();

	return (
		<>
			<h3 className={ styles.pageHeader }>A SAMPLE OF OUR WORK</h3>
			<Galleria jsonImages={ JSON.stringify(galleryImages) } isPublic={ true } />
			<div className={ styles.publicGalleryFooterOffset } />
		</>
	);
};

export default PublicGalleryServer;