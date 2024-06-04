'use server'

import { readFileSync } from 'node:fs';
import { redirect } from 'next/navigation'
import dayjs from 'dayjs';
import Image from 'next/image';

import FinalizeSection from 'app/(public)/invoice/finalize';

import PaymentHistory from 'components/public/PaymentHistory';

import { decryptNumber } from 'lib/utils';
import { getInvoice } from 'lib/http/invoicesDAO';

import styles from 'public/styles/page/quote.module.scss';
import logo from "assets/images/logos/white_logo_color_background.png";

const InvoiceServer = async ({ searchParams }) => {
	const orderId = decryptNumber(searchParams?.oid || '');
	const invoiceId = decryptNumber(searchParams?.iid || '');

	const invoice = await getInvoice(orderId, invoiceId);

	if (invoice === null || invoice.category === 'quote' ) {
		redirect('/');
	}

	// Pull the 'Terms and Conditions' from the file system
	const termsRawText = readFileSync(process.cwd() + '/' + invoice.termsFileHandle, { encoding: 'utf-8' });

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.logoHeaderContainer }>
				<Image src={ logo } alt="Logo" className={ styles.logoHeader } priority />
			</div>
			<div className={ styles.pageHeader }>INVOICE</div>

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
					<span className={ styles.infoColumnHeader }>ORDER #{ orderId }</span>
					<br />
					{ quote?.dates?.created ? 'Drafted on ' + dayjs(quote.dates.created).format('MMM DD, YYYY') : null }
					<br />
					Status: <i className={ styles.quoteStatusText }>{ quote.status.toUpperCase() }</i>
					<br />
					<span className={ styles.infoColumnHeader }>Salespeople</span>
					{ quote.sales.assignees.each((assignee) => {
						return (
							<>
								<br/>
								<span>{ assignee }</span>
							</>
						);
					})}
				</span>

				{ /* BILL TO INFO */ }
				<span className={ styles.infoColumnCustomer }>
					<span className={ styles.infoColumnHeader }>Customer</span>
					<br />
					{ quote.customer.name || '--' }
					{ quote.customer.address ? (
						<>
							<br />
							{ quote.customer.address }
						</>
					) : null }
					<br/>
					{ quote.customer.city ? + quote.customer.city + ', ' : null }{ quote.customer.state ? quote.customer.state + ' ' : null }{ quote.customer.zipCode || null }
					{ quote.customer.email.length ? (
						<>
							<br />
							{ quote.customer.email.length ? quote.customer.email.join(', ') : null }
						</>
					) : null }
					{ quote.customer.areaCode && quote.customer.phoneOne && quote.customer.phoneTwo ? (
						<>
							<br />
							{ quote.customer.areaCode + '-' + quote.customer.phoneOne + '-' + quote.customer.phoneTwo }
						</>
					) : null }
				</span>
			</div>

			{ quote.status !== 'open' ? (
				<div className={ styles.invoiceFinalizationNotice }>This quote has been { quote.status }.</div>
			) : null }

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

			<FinalizeSection
				orderId={ orderId }
				invoiceId={ invoiceId }
				termsText={ termsRawText }
				termsFileHandle={ quote.termsFileHandle }
				amountToPay={ quote.amount }
				invoiceStatus={ quote.status }
				jsonCards={ JSON.stringify(quote.payments.cards) }
			/>
		</div>
	);
};

export default QuoteServer;