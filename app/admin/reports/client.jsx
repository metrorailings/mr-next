'use client'

import React, { } from "react";
import dayjs from "dayjs";

import { } from '@fortawesome/free-solid-svg-icons'
import styles from 'public/styles/page/reports.module.scss';

const ReportsPage = () => {

//	const orders = JSON.parse(jsonOrders);
	const orders = [];

	return (
		<>
			<div id={styles.page_container}>
				<h3 className={styles.page_header}>DASHBOARD</h3>
				<hr className={styles.page_divider}></hr>

				<div id={styles.dashboard_bubbles_container}>
					{ orders.map((each, index) => {
						return (
							<span className={styles.dashboard_bubble} key={index}>
								<div className={styles.dashboard_bubble_body}>
									<div className={styles.dashboard_bubble_customer_name}>
										{ each.customer.company ? (
											<div className={styles.dashboard_bubble_company_text}>
												{each.customer.company}
											</div>
										) : null }
										<div>{ each.customer.name }</div>
									</div>
									<div className={styles.dashboard_bubble_info}>
										<div>
											{ each.status.toUpperCase() }
										</div>
										{ each.dates.due ? (
											<div>
												Due { dayjs(each.dates.due).format('MMMM DD') }
											</div>
										) : null }
										{ each.tasks && each.tasks.length ? (
											<div className={styles.dashboard_bubble_task}>
												<div className={styles.dashboard_bubble_task_header}>
													- Tasks -
												</div>
												<div>
													{ each.tasks[0].text }
												</div>
												{ each.tasks.length > 0 ? (
													<>
														<div>
															and more...
														</div>
													</>
												) : null }
											</div>
										) : null }
									</div>
								</div>
							</span>
						)
					})}
				</div>
			</div>
		</>
	);
};

export default ReportsPage;