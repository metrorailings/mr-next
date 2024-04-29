'use server'

import { redirect } from 'next/navigation'

import { translateDesignCode, fetchDesignMetadata } from 'lib/designs/translator';
import { decryptNumber } from 'lib/utils';
import { getOrderById } from 'lib/http/ordersDAO';

import styles from 'public/styles/page/quote.module.scss';
import logo from "assets/images/logos/white_logo_color_background.png";
import Image from 'next/image';

const QuoteServer = async ({ searchParams }) => {
	const orderHash = searchParams?.id || '';
	const orderId = decryptNumber(orderHash);
	let order, designs;
	if (orderId) {
		order = await getOrderById(orderId);
		designs = Object.keys(order.design);
	} else {
		redirect('/');
	}

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
					<span className={ styles.infoColumnHeader }>ORDER #{ order._id }</span>
					<br />
					Drafted on { order.dates?.quoted || '--' }
					<br />
					Status: <i>{ order.status === 'pending' ? 'Open' : 'Finalized' }</i>
				</span>

				{ /* BILL TO INFO */ }
				<span className={ styles.infoColumnCustomer }>
					<span className={ styles.infoColumnHeader }>Customer</span>
					<br />
					{ order?.customer?.name || '--' }
					<br/>
					{ order?.customer?.address || '--' }
					<br/>
					{ order?.customer?.city || '--' }, { order?.customer?.state || '--' }, { order?.customer?.zipCode || '--' }
					<br/>
					{ order?.customer?.email || '--' }
					<br/>
					{ order?.customer?.areaCode && order?.customer?.phoneOne && order?.customer?.phoneTwo ?
						order.customer.areaCode + '-' + order.customer.phoneOne + '-' + order.customer.phoneTwo :
						'--' }
				</span>
			</div>
			
			<div className={ styles.quoteContainer }>

				<div className={ styles.quoteBody }>
					{ /* SUMMARY */ }
					{ order?.text?.additionalDescription ? (
						<div className={ styles.quoteMemo } dangerouslySetInnerHTML={{ __html: order.text.additionalDescription }} />
					) : null }

					{ /* DESIGN DETAILS */ }
					{ order?.design?.type !== 'T-MISC' ? (
						<div className={ styles.quoteDesignDetails }>
							{ designs.map((design, index) => {
								let designSpecifics = translateDesignCode(order.design[design]);
								let designMetadata = fetchDesignMetadata(order.design[design]);
								return (
									<div className={ styles.quoteDesignRow } key={ index }>
										<span className={ styles.quoteDesignRowLabel }>
											<div className={ styles.quoteDesignRowCategory }>{ designMetadata.technicalLabel }</div>
											<div className={ styles.quoteDesignRowSelection }>{ designSpecifics.label }</div>
										</span>
										<span className={ styles.quoteDesignRowDescriptor }>{ order.designDescription[design] }</span>
									</div>
								);
							})}
						</div>
					) : null }
				</div>

				{ /* PRICE */ }
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Subtotal</span>
					<span className={ styles.quotePriceListing }>${ order?.pricing?.subtotal?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Tax</span>
					<span className={ styles.quotePriceListing }>${ order?.pricing?.tax?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>AMOUNT DUE</span>
					<span className={ styles.quotePriceListing }>${ order?.pricing?.orderTotal?.toFixed(2) || '--' }</span>
				</div>

			</div>
		</div>
	);
};

export default QuoteServer;