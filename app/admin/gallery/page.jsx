import GalleryPage from "app/admin/gallery/client";

import { getGalleryImages } from "app/api/gallery/DAO";

const GalleryServer = async () => {

	const galleryImages = await getGalleryImages();
	
	return (
		<>
			<GalleryPage
				jsonImages={ JSON.stringify(galleryImages || []) }
			/>
		</>
	);
};

export default GalleryServer;