import React from 'react';

export function orderStatus(order) {
    if (order.isDelivered) return 'Delivered';
    if (order.shippedAt) return 'Shipped';
    if (order.isPaid) return 'Paid';
    return 'Awaiting payment';
}

export function formatOrderDate(value) {
    return value ? new Date(value).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
    }) : '';
}

export default function OrderTimeline({ order }) {
    const steps = [
        ['Placed', true, order.createdAt],
        ['Paid', order.isPaid, order.paidAt],
        ['Shipped', Boolean(order.shippedAt || order.isDelivered), order.shippedAt],
        ['Delivered', order.isDelivered, order.deliveredAt],
    ];

    return (
        <section className="card-body" aria-label="Order timeline">
            <div className="order-heading-line">
                <h2>Order timeline</h2>
                <span className="order-status">{orderStatus(order)}</span>
            </div>
            <ol className="order-timeline">
                {steps.map(([label, completed, date]) => (
                    <li key={label} className={completed ? 'complete' : undefined}>
                        <strong>{label}</strong>
                        <span>{date ? <time dateTime={date}>{formatOrderDate(date)}</time>
                            : completed ? 'Complete' : 'Pending'}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
