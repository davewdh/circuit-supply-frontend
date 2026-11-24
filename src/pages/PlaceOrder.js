import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { OrderItems, OrderSummary, ShippingSummary } from '../components/OrderSummary';
import { createdOrder } from '../actions/OrderAction';
import { ORDER_CREATE_RESET } from '../constants/OrderConstant';
import axios from '../Axios';

export default function PlaceOrder({ history }) {
    const dispatch = useDispatch();
    const { cartItems, shippingAddress, paymentMethod } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.userSignin);
    const { loading, success, error, order } = useSelector(state => state.orderCreate);
    const [checkoutId] = useState(() => window.crypto.randomUUID());
    const [quote, setQuote] = useState(null);
    const [quoteError, setQuoteError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        if (!userInfo || !shippingAddress?.address || !paymentMethod || !cartItems.length) return;
        let active = true;
        setQuote(null);
        setQuoteError('');

        axios.post('/api/orders/quote', { orderItems: cartItems }, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        }).then(({ data }) => {
            if (active) setQuote(data);
        }).catch(error => {
            if (active) setQuoteError(error.response?.data?.message || 'Unable to load the order summary.');
        });

        return () => { active = false; };
    }, [cartItems, paymentMethod, refresh, shippingAddress, userInfo]);

    useEffect(() => {
        if (success) {
            history.replace('/order/' + order._id);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, history, order, success]);

    if (success) return <LoadingBox />;
    if (!userInfo) return <Redirect to="/signin?redirect=/placeorder" />;
    if (!cartItems.length) return <Redirect to="/cart" />;
    if (!shippingAddress?.address) return <Redirect to="/shipping" />;
    if (!paymentMethod) return <Redirect to="/payment" />;

    const priceChanged = quote?.orderItems.some((item, index) => item.price !== cartItems[index].price);

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <main className="page-shell">
                <h1 className="order-review-title">Review your order</h1>
                {quoteError ? (
                    <>
                        <MessageBox variant="danger">{quoteError}</MessageBox>
                        <Link className="back-res order-return-link" to="/cart">Back to cart</Link>
                    </>
                ) : !quote ? <LoadingBox /> : (
                    <div className="row-container">
                        <div className="order-panel-stack">
                            <ShippingSummary address={shippingAddress} />
                            <OrderItems items={quote.orderItems} />
                        </div>
                        <OrderSummary order={quote}>
                            {priceChanged && <MessageBox>Prices changed since you added items. The current prices are shown here.</MessageBox>}
                            <p className="order-payment-note">Payment is through PayPal Sandbox.</p>
                            <button className="store-primary order-action" type="button" disabled={loading}
                                onClick={() => dispatch(createdOrder({ checkoutId, orderItems: quote.orderItems, shippingAddress, paymentMethod }))}>
                                {loading ? 'Placing order…' : 'Place order'}
                            </button>
                            {error && (
                                <>
                                    <MessageBox variant="danger">{error}</MessageBox>
                                    <button className="order-details-btn order-action" type="button" onClick={() => {
                                        dispatch({ type: ORDER_CREATE_RESET });
                                        setRefresh(value => value + 1);
                                    }}>Refresh order summary</button>
                                </>
                            )}
                        </OrderSummary>
                    </div>
                )}
            </main>
        </>
    );
}
