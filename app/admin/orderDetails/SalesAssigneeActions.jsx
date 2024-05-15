'use client'

import React, { useContext } from "react";

import { OrdersContext, OrdersDispatchContext } from 'app/admin/orderDetails/orderContext';

import styles from 'public/styles/page/orderDetails.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

const SalesAssigneeActions = ({ valueInContext }) => {

	const orderDetails = useContext(OrdersContext);
	const orderDispatch = useContext(OrdersDispatchContext);
	let assignee = orderDetails.sales.assignees.find((assignee) => assignee.username === valueInContext);

	const removeValue = () => {
		orderDispatch({
			type: 'removeSalesAssignee',
			value: valueInContext
		});
	};

	const updateSalesCommission = (event) => {
		assignee.commission = parseFloat(event.currentTarget.value);

		orderDispatch({
			type: 'updateSalesAssigneeInfo',
			value: assignee
		});
	}

	return (
		<>
			<span>
				<button type='button' className={ styles.salesmanDeleteButton } onClick={ removeValue }>Delete<FontAwesomeIcon icon={ faEraser } /></button>
			</span>
			<span>
				<label class={ styles.orderFormLabel }>Commission Percentage</label>
				<input
					type='tel'
					className={ styles.smallInputControl }
					onChange={ updateSalesCommission }
					value={ assignee.commission }
				/>
				<span className={ styles.orderInputNeighboringText }>%</span>
			</span>
		</>
	);
}

export default SalesAssigneeActions;