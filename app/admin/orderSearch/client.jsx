'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useMemo, useRef, useEffect } from "react";

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
			<div id={styles.page_container}>
				<div id={styles.page_button_section}>
					<button id={styles.create_order_button}>Create Order</button>
				</div>

				<hr className={styles.section_divider}></hr>

				<div id={styles.filter_section}>
					<div className={styles.filter_row}>
						<span className={styles.filter_label}>Status</span>
						<span className={styles.filter_values}>
							<a className={styles.status_value + (filters.status === '' ? ' ' + styles.selected : '')} data-status='' onClick={ updateStatusFilter }>All</a>
							<a className={styles.status_value + (filters.status === 'open' ? ' ' + styles.selected : '')} data-status='open' onClick={ updateStatusFilter }>Open</a>
							<a className={styles.status_value + (filters.status === 'prospect' ? ' ' + styles.selected : '')} data-status='prospect' onClick={ updateStatusFilter }>Prospect</a>
							<a className={styles.status_value + (filters.status === 'pending' ? ' ' + styles.selected : '')} data-status='pending' onClick={ updateStatusFilter }>Pending Confirmation</a>
							<a className={styles.status_value + (filters.status === 'material' ? ' ' + styles.selected : '')} data-status='material' onClick={ updateStatusFilter }>Material</a>
							<a className={styles.status_value + (filters.status === 'shop' ? ' ' + styles.selected : '')} data-status='shop' onClick={ updateStatusFilter }>Production</a>
							<a className={styles.status_value + (filters.status === 'install' ? ' ' + styles.selected : '')} data-status='install' onClick={ updateStatusFilter }>Install</a>
							<a className={styles.status_value + (filters.status === 'closing' ? ' ' + styles.selected : '')} data-status='closing' onClick={ updateStatusFilter }>Closing</a>
							<a className={styles.status_value + (filters.status === 'closed' ? ' ' + styles.selected : '')} data-status='closed' onClick={ updateStatusFilter }>Closed</a>
							<a className={styles.status_value + (filters.status === 'cancelled' ? ' ' + styles.selected : '')} data-status='cancelled' onClick={ updateStatusFilter }>Cancelled</a>
						</span>
					</div>
					<div className={styles.filter_row}>
						<span className={styles.filter_label}>Search</span>
						<span className={styles.filter_input_grouping}>
							<input
								type='text'
								className={styles.large_input_control}
								onChange={ updateSearchFilter }
								placeholder={ 'Search orders using customer information' }
								value={ filters.search }
							/>
							<span className={styles.input_grouping_icon}>
								<FontAwesomeIcon
									icon={ faCircleXmark }
									onClick={() => { updateSearchFilter({ currentTarget: { value: '' }}); }}
								/>
							</span>
						</span>
					</div>
				</div>

				<hr className={styles.section_divider}></hr>

				<div id={styles.orders_listing}>
					{ filteredOrders.slice(0, filters.page * 10).map((order, index) => {
						return (
							<div id={'order_box_' + index} key={index} className={styles.order_box} >
								<div className={styles.order_box_info_row}>
									<span className={styles.order_box_general_info_column}>
										<div className={styles.order_box_id}>{ order._id }</div>
										<div className={styles.order_box_status}>{ order.status }</div>
									</span>

									<span className={styles.order_box_customer_info_column}>
										<div className={styles.order_box_general_info_header}>Customer Info</div>
										<div className={styles.order_box_customer_info_sub_column}>

											<div className={styles.order_box_datum}>
												<FontAwesomeIcon className={styles.order_box_icon} icon={faUserTag} />
												<span>
													{ order.customer.company ? (
														<div className={styles.italicized_text}>{ order.customer.company }</div>
													) : null }
													<div>{ order.customer.name }</div>
												</span>
											</div>

											<div className={styles.order_box_datum}>
												<FontAwesomeIcon className={styles.order_box_icon} icon={faLocationDot} />
												<a target='_blank' href={ generateGoogleLink(order.customer) }>
													{ order.customer.address }
													<br />
													{ order.customer.city ? order.customer.city + ',' + order.customer.state : '' }
												</a>
											</div>

											<div className={styles.order_box_datum}>
												<FontAwesomeIcon className={styles.order_box_icon} icon={faSquareEnvelope} />
												<span>
													{ order.customer.email.split(',').map((email, index) => {
														return (
															<div key={index}>{ email }</div>
														)
													})}
												</span>
											</div>

											<div className={styles.order_box_datum}>
												<FontAwesomeIcon className={styles.order_box_icon} icon={faSquarePhone} />
												<a href={ generatePhoneNumber(order.customer) }>
													{ '(' + order.customer.areaCode + ') ' + order.customer.phoneOne + '-' + order.customer.phoneTwo }
												</a>
											</div>

										</div>
									</span>

									<span className={styles.order_box_date_column}>
										<div className={styles.order_box_dates_header}>Dates</div>
										<div className={styles.order_box_customer_info_sub_column}>

											<div className={styles.order_box_date_datum}>
												<div className={styles.order_box_date_label}>Created:</div>
												<div>{ order.dates.created + (order.users?.creator ? ' (' + order.users.creator + ')' : '')}</div>
											</div>

											<div className={styles.order_box_date_datum}>
												{ order.dates?.lastModified ? (
													<>
														<div className={styles.order_box_date_label}>Last Updated:</div>
														<div>{ order.dates.lastModified + (order.users?.lastModifier ? ' (' + order.users.lastModifier + ')' : '')}</div>
													</>
												) : null }
											</div>

											<div className={styles.order_box_date_datum}>
												{ order.dates?.due ? (
													<>
														<div className={styles.order_box_date_label}>Due Date:</div>
														<div>{ order.dates.due }</div>
													</>
												) : null }
											</div>

										</div>
									</span>
								</div>

							</div>
						);
					}) }
				</div>

				<hr className={styles.section_divider} ref={observerTarget}></hr>
			</div>

		</>
	);
};

export default OrderSearchPage;