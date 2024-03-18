import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import React from 'react';

import styles from 'public/styles/page/home.module.scss';

const ReviewSkeleton = () => {
	return (
		<SkeletonTheme baseColor={ styles.silverSkeleton } highlightColor={ styles.whiteHighlighter }>
			<div className={ styles.reviewBlock }>
				<Skeleton count={ 5 } containerClassName={ styles.reviewBlockBody } />
				<Skeleton containerClassName={ styles.reviewBlockAuthor } />
				<Skeleton containerClassName={ styles.reviewBlockAuthor } />
				<Skeleton containerClassName={ styles.reviewBlockData } />
				<Skeleton containerClassName={ styles.reviewBlockData } />
				<Skeleton containerClassName={ styles.reviewBlockImages } height={ 200 } />
			</div>
		</SkeletonTheme>
	);
}

export default ReviewSkeleton;