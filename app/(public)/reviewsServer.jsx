import ReviewSection from 'app/(public)/reviews';

import { getGoogleReviews } from 'lib/google';

const ReviewsServer = async () => {
	const googleReviews = await getGoogleReviews();

	return (
		<ReviewSection jsonReviews={ JSON.stringify(googleReviews) } />
	);
}

export default ReviewsServer;