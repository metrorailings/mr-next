'use server'

import { readFileSync } from 'node:fs';
import { redirect } from 'next/navigation'
import Image from 'next/image';

import FinalizeSection from 'app/(public)/quote/finalize';

import { translateDesignCode, fetchDesignMetadata } from 'lib/designs/translator';
import { decryptNumber } from 'lib/utils';
import { getInvoice } from 'lib/http/invoicesDAO';

import styles from 'public/styles/page/quote.module.scss';
import logo from "assets/images/logos/white_logo_color_background.png";

const QuoteServer = async ({ searchParams }) => {
	const orderHash = searchParams?.id || '';
	const quoteSeq = searchParams?.seq || '';
	const orderId = decryptNumber(orderHash);
	const quote = await getInvoice(orderId, quoteSeq);

	if (quote === null || quote.category !== 'quote' ) {
		redirect('/');
	}

	// Grab a list of all selected design options
	const designs = Object.keys(quote.design);

	// Pull the 'Terms and Conditions' from the file system
	const termsRawText = readFileSync(quote.termsFileHandle, { encoding: 'utf-8' });

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.logoHeaderContainer }>
				<Image src={ logo } alt="Logo" className={ styles.logoHeader } priority />
			</div>
			<div className={ styles.pageHeader }>QUOTE</div>
			
			<div className={ styles.infoSection }>
				{ /* COMPANY INFO */ }
				<span className={ styles.infoColumnCompany }>
					<span className={ styles.infoColumnHeader }>Metro Railings</span>
					<br />
					{ process.env.NEXT_PUBLIC_COMPANY_ADDRESS_1 }
					<br/>
					{ process.env.NEXT_PUBLIC_COMPANY_ADDRESS_2 }
					<br/>
					{ process.env.NEXT_PUBLIC_COMPANY_EMAIL }
					<br/>
					{ process.env.NEXT_PUBLIC_COMPANY_PHONE_NUMBER }
				</span>

				{ /* ORDER ID */ }
				<span className={ styles.infoColumnOrder }>
					<span className={ styles.infoColumnHeader }>ORDER #{ quote.orderId }</span>
					<br />
					Drafted on { quote.dates.created || '--' }
					<br />
					Status: <i className={ styles.quoteStatusText }>{ quote.status.toUpperCase() }</i>
				</span>

				{ /* BILL TO INFO */ }
				<span className={ styles.infoColumnCustomer }>
					<span className={ styles.infoColumnHeader }>Customer</span>
					<br />
					{ quote.customer.name || '--' }
					<br/>
					{ quote.customer.address || '--' }
					<br/>
					{ quote.customer.city || '--' }, { quote.customer.state || '--' }, { quote.customer.zipCode || '--' }
					<br/>
					{ quote.customer.email.length ? quote.customer.email.join(', ') : '--' }
					<br/>
					{ quote.customer.areaCode && quote.customer.phoneOne && quote.customer.phoneTwo ?
						quote.customer.areaCode + '-' + quote.customer.phoneOne + '-' + quote.customer.phoneTwo : '--' }
				</span>
			</div>
			
			<div className={ styles.quoteContainer }>
				<div className={ styles.quoteBody }>

					{ /* SUMMARY */ }
					{ quote.text.additionalDescription ? (
						<div className={ styles.quoteMemo } dangerouslySetInnerHTML={{ __html: quote.text.additionalDescription }} />
					) : null }

					{ /* DESIGN DETAILS */ }
					{ quote.design.type !== 'T-MISC' ? (
						<div className={ styles.quoteDesignDetails }>
							{ designs.map((design, index) => {
								let designSpecifics = translateDesignCode(quote.design[design]);
								let designMetadata = fetchDesignMetadata(quote.design[design]);
								return (
									<div className={ styles.quoteDesignRow } key={ index }>
										<span className={ styles.quoteDesignRowLabel }>
											<div className={ styles.quoteDesignRowCategory }>{ designMetadata.technicalLabel }</div>
											<div className={ styles.quoteDesignRowSelection }>{ designSpecifics.label }</div>
										</span>
										<span className={ styles.quoteDesignRowDescriptor }>{ quote.designDescription[design] }</span>
									</div>
								);
							})}
						</div>
					) : null }
				</div>

				{ /* PRICE */ }
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Subtotal</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.subtotal?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Tax</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.tax?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>AMOUNT DUE</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.orderTotal?.toFixed(2) || '--' }</span>
				</div>

			</div>

			<FinalizeSection orderId={ quote.orderId } termsText={ termsRawText } termsFileHandle={ quote.termsFileHandle } amountToPay={ quote.amount } jsonCards={ JSON.stringify(quote.payments.cards) }/>
		</div>
	);
};

export default QuoteServer;