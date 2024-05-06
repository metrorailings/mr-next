import Gallery from 'app/admin/gallery/gallery';
import AddForm from 'app/admin/gallery/addForm';

import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/gallery.module.scss';

const GalleryServer = async () => {

	const galleryImages = await getGalleryImages();

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.pageHeader }>GALLERY MANAGEMENT</div>
			<Gallery jsonImages={ JSON.stringify(galleryImages) } />
			<AddForm />
		</div>
	);

};

export default GalleryServer;