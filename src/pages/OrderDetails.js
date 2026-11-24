import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder } from '../actions/OrderAction';
import axios from '../Axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { OrderItems, OrderSummary, ShippingSummary } from '../components/OrderSummary';
import OrderTimeline from '../components/OrderTimeline';
import SandboxPayment from '../components/SandboxPayment';

export default function OrderDetails({ match }) {
    const orderId = match.params.id;
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userSignin);
    const { order, loading, error } = useSelector(state => state.orderDetails);

    useEffect(() => {
        dispatch(detailsOrder(orderId));
    }, [dispatch, orderId, userInfo.token]);

    return (
        <main className="page-shell">
            <Link className="back-res" to="/orderhistory">Order history</Link>
            {error ? <MessageBox variant="danger">{error}</MessageBox> :
                loading || order?._id !== orderId ? <LoadingBox /> :
                <OrderView key={orderId} initialOrder={order} user={userInfo} />}
        </main>
    );
}

function OrderView({ initialOrder, user }) {
    const [order, setOrder] = useState(initialOrder);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const isOwner = String(order.user) === String(user._id);
    const nextStatus = order.isPaid && !order.isDelivered ? (order.shippedAt ? 'delivered' : 'shipped') : null;

    async function updateFulfillment() {
        setUpdating(true);
        setError('');
        try {
            const { data } = await axios.patch(`/api/orders/${order._id}/fulfillment`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setOrder(data);
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to update this order.');
        } finally {
            setUpdating(false);
        }
    }

    return (
        <>
            <h1 id="order-id">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <div className="row-container">
                <div className="order-panel-stack">
                    <OrderTimeline order={order} />
                    <ShippingSummary address={order.shippingAddress} />
                    <OrderItems items={order.orderItems} />
                </div>
                <OrderSummary order={order}>
                    {!order.isPaid && isOwner && (
                        <SandboxPayment orderId={order._id} token={user.token} onPaid={setOrder} />
                    )}
                    {user.isAdmin && nextStatus && (
                        <button className="store-primary order-action" type="button"
                            disabled={updating} onClick={updateFulfillment}>
                            {updating ? 'Updating…' : `Mark as ${nextStatus}`}
                        </button>
                    )}
                    {error && <MessageBox variant="danger">{error}</MessageBox>}
                </OrderSummary>
            </div>
        </>
    );
}
