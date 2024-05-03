'use server'

import { readFileSync } from 'node:fs';
import Markdown from 'react-markdown';

import styles from 'public/styles/page/terms.module.scss';

const TermsServer = () => {

	// Pull the 'Terms and Conditions' from the file system
	const termsRawText = readFileSync('assets/text/terms.txt', { encoding: 'utf-8' });

	return (
		<div className={ styles.termsAndConditions }>
			<Markdown>{ termsRawText }</Markdown>
		</div>
	);
};

export default TermsServer;