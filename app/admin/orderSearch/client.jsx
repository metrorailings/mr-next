'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useMemo, useRef, useEffect } from "react";

import FileUpload from 'components/admin/fileUpload';

import styles from 'public/styles/page/orderSearch.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faUserTag, faLocationDot, faSquareEnvelope, faSquarePhone } from '@fortawesome/free-solid-svg-icons'

import { filterOrders } from "app/admin/orderSearch/orderFilter";

const OrderSearchPage = ({ jsonOrders, jsonFilteredOrders }) => {

	const searchParams = new useSearchParams();
	const pathName = usePathname();
	const orders = useMemo(() => JSON.parse(jsonOrders), [jsonOrders]);
	const [filteredOrders, setFilteredOrders] = useState(JSON.parse(jsonFilteredOrders));
	const [filters, setFilters] = useState({
		status: searchParams.get('status') || '',
		search: searchParams.get('search') || '',
		page: 1,
		maxPage: Math.ceil(filteredOrders.length / 10) // Used to determine how many times we can render new data for infinite scroll
	});
	const observerTarget = useRef(null);

	useEffect(() => {
		// Observer to allow for infinite scrolling so that more orders are only loaded once the user scrolls down far enough
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setFilters((prevState) => {
						return {
							...prevState,
							page: (prevState.page < prevState.maxPage ? prevState.page + 1 : prevState.page)
						}
					});
				}
			},{ threshold: 0.5 });
		const observedNode = observerTarget?.current || null;
		
		if (observedNode) {
			observer.observe(observedNode);
		}

		return () => {
			if (observedNode) {
				observer.unobserve(observedNode);
			}
		};
	}, [observerTarget]);

	const updateStatusFilter = (event) => {
		const newFilters = {
			...filters,
			status: event.currentTarget.dataset.status,
			page: 1
		};
		const newlyFilteredOrders = filterOrders(orders, newFilters);
		
		setFilters({
			...newFilters,
			maxPage: Math.ceil(newlyFilteredOrders.length / 10)
		});
		setFilteredOrders(newlyFilteredOrders);

		updateQueryParams(newFilters.status, newFilters.search);
	};

	const updateSearchFilter = (event) => {
		const newFilters = {
			...filters,
			search: event.currentTarget.value,
			page: 1
		};
		const newlyFilteredOrders = filterOrders(orders, newFilters);

		setFilters({
			...newFilters,
			maxPage: Math.ceil(newlyFilteredOrders.length / 10)
		});
		setFilteredOrders(newlyFilteredOrders);

		updateQueryParams(newFilters.status, newFilters.search);
	};

	// A function to update the query parameters any time filters are updated
	const updateQueryParams = (status, search) => {
		let queryParams = [];
		
		if (status) {
			queryParams.push('status=' + status);
		}
		if (search) {
			queryParams.push('search=' + search);
		}

		window.history.pushState({}, "", pathName + (queryParams.length ? '?' + queryParams.join('&') : ''));
	};

	const generateGoogleLink = (customer) => {
		const params = (customer.address ? customer.address.trim().split(' ').join('+') : '') +
			(customer.city ? customer.city.trim().split(' ').join('+') : '') +
			(customer.state || '');

		return (params ? 'https://www.google.com/maps/search/?api=1&query=' + params : '#');
	}

	const generatePhoneNumber = (customer) => {
		if (customer.areaCode && customer.phoneOne && customer.phoneTwo) {
			return 'tel:' + customer.areaCode + customer.phoneOne + customer.phoneTwo;
		}

		return '#';
	}

	return (
		<>
			<div className={ styles.pageContainer }>
				<div className={ styles.pageButtonSection }>
					<button className={ styles.createOrderButton }>Create Order</button>
				</div>

				<hr className={ styles.sectionDivider }></hr>

				<div className={ styles.filterSection }>
					<div className={ styles.filterRow }>
						<span className={ styles.filterLabel }>Status</span>
						<span className={ styles.filterValues }>
							<a className={ (filters.status === '' ? styles['selected'] : '') } data-status='' onClick={ updateStatusFilter }>All</a>
							<a className={ (filters.status === 'open' ? styles['selected'] : '') } data-status='open' onClick={ updateStatusFilter }>Open</a>
							<a className={ (filters.status === 'prospect' ? styles['selected'] : '') } data-status='prospect' onClick={ updateStatusFilter }>Prospect</a>
							<a className={ (filters.status === 'pending' ? styles['selected'] : '') } data-status='pending' onClick={ updateStatusFilter }>Pending Confirmation</a>
							<a className={ (filters.status === 'material' ? styles['selected'] : '') } data-status='material' onClick={ updateStatusFilter }>Material</a>
							<a className={ (filters.status === 'shop' ? styles['selected'] : '') } data-status='shop' onClick={ updateStatusFilter }>Production</a>
							<a className={ (filters.status === 'install' ? styles['selected'] : '') } data-status='install' onClick={ updateStatusFilter }>Install</a>
							<a className={ (filters.status === 'closing' ? styles['selected'] : '') } data-status='closing' onClick={ updateStatusFilter }>Closing</a>
							<a className={ (filters.status === 'closed' ? styles['selected'] : '') } data-status='closed' onClick={ updateStatusFilter }>Closed</a>
							<a className={ (filters.status === 'cancelled' ? styles['selected'] : '') } data-status='cancelled' onClick={ updateStatusFilter }>Cancelled</a>
						</span>
					</div>
					<div className={ styles.filterRow }>
						<span className={ styles.filterLabel }>Search</span>
						<span className={ styles.filterInputGrouping }>
							<input
								id='order_search_text_field'
								type='text'
								className={ styles.orderSearchField }
								onChange={ updateSearchFilter }
								placeholder={ 'Search orders using customer information' }
								value={ filters.search }
							/>
							<span className={ styles.orderSearchFieldIcon }>
								<FontAwesomeIcon
									icon={ faCircleXmark }
									onClick={() => { updateSearchFilter({ currentTarget: { value: '' }}); }}
								/>
							</span>
						</span>
					</div>
				</div>

				<hr className={ styles.sectionDivider }></hr>

				<div className={ styles.ordersListing }>
					{ filteredOrders.slice(0, filters.page * 10).map((order, index) => {
						return (
							<div id={'order_box_' + index} key={ index } className={ styles.orderBox } >
								<div className={ styles.orderBoxInfoRow }>
									<span className={ styles.orderBoxGeneralInfoColumn }>
										<div className={ styles.orderBoxId }>{ order._id }</div>
										<div className={ styles.orderBoxStatus }>{ order.status }</div>
									</span>

									<span className={ styles.orderBoxCustomerInfoColumn }>
										<div className={ styles.orderBoxGeneralInfoHeader }>Customer Info</div>
										<div className={ styles.orderBoxCustomerInfoSubColumn }>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faUserTag } />
												<span>
													{ order.customer.company ? (
														<div className={ styles.orderBoxCompanyName }>{ order.customer.company }</div>
													) : null }
													<div>{ order.customer.name }</div>
												</span>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faLocationDot } />
												<a target='_blank' href={ generateGoogleLink(order.customer) }>
													{ order.customer.address }
													<br />
													{ order.customer.city ? order.customer.city + ',' + order.customer.state : '' }
												</a>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faSquareEnvelope } />
												<span>
													{ order.customer.email.split(',').map((email, index) => {
														return (
															<div key={index}>{ email }</div>
														)
													})}
												</span>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faSquarePhone } />
												<a href={ generatePhoneNumber(order.customer) }>
													{ '(' + order.customer.areaCode + ') ' + order.customer.phoneOne + '-' + order.customer.phoneTwo }
												</a>
											</div>

										</div>
									</span>

									<span className={ styles.orderBoxDateColumn }>
										<div className={ styles.orderBoxDatesHeader }>Dates</div>
										<div className={ styles.orderBoxCustomerInfoSubColumn }>

											<div className={ styles.orderBoxDateDatum }>
												<div className={ styles.orderBoxDateLabel }>Created:</div>
												<div>{ order.dates.created + (order.users?.creator ? ' (' + order.users.creator + ')' : '')}</div>
											</div>

											<div className={ styles.orderBoxDateDatum }>
												{ order.dates?.lastModified ? (
													<>
														<div className={ styles.orderBoxDateLabel }>Last Updated:</div>
														<div>{ order.dates.lastModified + (order.users?.lastModifier ? ' (' + order.users.lastModifier + ')' : '')}</div>
													</>
												) : null }
											</div>

											<div className={ styles.orderBoxDateDatum }>
												{ order.dates?.due ? (
													<>
														<div className={ styles.orderBoxDateLabel }>Due Date:</div>
														<div>{ order.dates.due }</div>
													</>
												) : null }
											</div>

										</div>
									</span>
								</div>

								<div className={ styles.orderBoxFileUpload }>
									<FileUpload
										orderId={ order._id }
										existingFiles={ order.files }
										lazyLoad={ true }
									/>
								</div>
							</div>
						);
					})}
				</div>

				<hr className={ styles.sectionDivider } ref={ observerTarget }></hr>
			</div>

		</>
	);
};

export default OrderSearchPage;