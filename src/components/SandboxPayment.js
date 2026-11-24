import React, { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from '../Axios';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

export default function SandboxPayment({ orderId, token, onPaid }) {
    const [configuration, setConfiguration] = useState(undefined);
    const [error, setError] = useState('');
    const [needsConfirmation, setNeedsConfirmation] = useState('');
    const [confirming, setConfirming] = useState(false);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        let active = true;
        axios.get('/api/config/paypal').then(({ data }) => {
            if (active) setConfiguration(data.clientId || null);
        }).catch(() => {
            if (active) setConfiguration(null);
        });
        return () => { active = false; };
    }, []);

    async function createOrder() {
        setError('');
        const { data } = await axios.post(`/api/orders/${orderId}/paypal`, {}, { headers });
        return data.id;
    }

    async function confirm(orderID) {
        setError('');
        setConfirming(true);
        try {
            const { data } = await axios.put(`/api/orders/${orderId}/pay`, { orderID }, { headers });
            onPaid(data.order);
        } catch (error) {
            setNeedsConfirmation(orderID);
            setError(error.response?.data?.message || 'Could not confirm the payment. Try confirming again.');
        } finally {
            setConfirming(false);
        }
    }

    if (configuration === undefined) return <LoadingBox />;
    if (!configuration) return <MessageBox>PayPal Sandbox is currently unavailable.</MessageBox>;

    return (
        <div className="order-page-pay-btn">
            <p className="order-payment-note">PayPal Sandbox · No real payment</p>
            {needsConfirmation || confirming ? (
                <button className="store-primary order-action" type="button" disabled={confirming}
                    onClick={() => confirm(needsConfirmation)}>
                    {confirming ? 'Confirming payment…' : 'Retry payment confirmation'}
                </button>
            ) : (
                <PayPalButton options={{ clientId: configuration, currency: 'USD' }}
                    createOrder={createOrder} onApprove={({ orderID }) => confirm(orderID)}
                    onError={() => setError('PayPal Sandbox could not load or start the payment. Try again.')} />
            )}
            {error && <MessageBox variant="danger">{error}</MessageBox>}
        </div>
    );
}
