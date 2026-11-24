import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { savePaymentMethod } from '../actions/CartAction';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentMethod({ history }) {
    const { shippingAddress } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    if (!shippingAddress?.address) return <Redirect to="/shipping" />;

    return (
        <>
            <CheckoutSteps step1 step2 step3 />
            <main className="pay-method-container">
                <form className="form" onSubmit={event => {
                    event.preventDefault();
                    dispatch(savePaymentMethod('PayPal'));
                    history.push('/placeorder');
                }}>
                    <h1>Payment method</h1>
                    <p>PayPal Sandbox</p>
                    <p className="order-payment-note">Use a PayPal Sandbox account to try checkout without a real charge.</p>
                    <button className="submit-btn" type="submit">Review order</button>
                </form>
            </main>
        </>
    );
}
