import React from 'react';
import CatalogImage from './CatalogImage';
import { Link } from 'react-router-dom';

export const money = value => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
}).format(value);

export function OrderItems({ items }) {
    return (
        <section className="card-body">
            <h2>Order items</h2>
            <ul className="order-item-list">
                {items.map(item => (
                    <li key={item.product} className="row1 order-row1">
                        <div className="small"><CatalogImage src={item.image} /></div>
                        <div>
                            <Link to={'/products/product/' + item.product}>{item.name}</Link>
                            <span className="order-item-quantity">Qty {item.qty}</span>
                        </div>
                        <strong>{money(item.price * item.qty)}</strong>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function ShippingSummary({ address, editable }) {
    return (
        <section className="card-body">
            <div className="order-heading-line">
                <h2>Shipping address</h2>
                {editable && <Link className="rating-signin" to="/shipping">Edit address</Link>}
            </div>
            <address>
                <strong>{address.fullName}</strong><br />
                {address.address}<br />
                {address.addressLine2 && <>{address.addressLine2}<br /></>}
                {[address.city, address.region, address.postalcode].filter(Boolean).join(', ')}<br />
                {address.country}
            </address>
        </section>
    );
}

export function OrderSummary({ order, children }) {
    return (
        <aside className="card-body order-summary">
            <h2>Order summary</h2>
            <dl>
                <div><dt>Items</dt><dd>{money(order.itemsPrice)}</dd></div>
                <div><dt>Shipping</dt><dd>{order.shippingPrice ? money(order.shippingPrice) : 'Free'}</dd></div>
                <div><dt>Tax</dt><dd>{money(order.taxPrice)}</dd></div>
                <div className="order-summary-total"><dt>Total (USD)</dt><dd>{money(order.totalPrice)}</dd></div>
            </dl>
            {children}
        </aside>
    );
}
