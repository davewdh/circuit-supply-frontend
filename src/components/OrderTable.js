import React from 'react';
import { Link } from 'react-router-dom';
import { money } from './OrderSummary';
import { formatOrderDate, orderStatus } from './OrderTimeline';

export default function OrderTable({ orders }) {
    return (
        <div className="order-table-scroll">
            <table className="table order-table">
                <thead>
                    <tr><th>Order</th><th>Placed</th><th>Status</th><th>Total</th><th>Details</th></tr>
                </thead>
                <tbody>
                    {orders.map(order => {
                        const reference = order._id.slice(-8).toUpperCase();
                        return (
                            <tr key={order._id}>
                                <td>#{reference}</td>
                                <td>{formatOrderDate(order.createdAt)}</td>
                                <td><span className="order-status">{orderStatus(order)}</span></td>
                                <td>{money(order.totalPrice)}</td>
                                <td><Link className="order-details-btn" aria-label={'View order ' + reference}
                                    to={'/order/' + order._id}>View order</Link></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
