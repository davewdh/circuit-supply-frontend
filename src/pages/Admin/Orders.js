import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from '../../Axios';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import OrderTable from '../../components/OrderTable';

export default function Orders() {
    const { userInfo } = useSelector(state => state.userSignin);
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userInfo.isAdmin) return;
        let active = true;
        axios.get('/api/orders/admin', { headers: { Authorization: `Bearer ${userInfo.token}` } })
            .then(({ data }) => { if (active) setOrders(data); })
            .catch(error => {
                if (active) setError(error.response?.data?.message || 'Unable to load orders.');
            });
        return () => { active = false; };
    }, [userInfo]);

    if (!userInfo.isAdmin) return <Redirect to="/" />;

    return (
        <main className="orderhistory-container">
            <h1>Manage orders</h1>
            {error ? <MessageBox variant="danger">{error}</MessageBox> :
                !orders ? <LoadingBox /> : orders.length ? <OrderTable orders={orders} /> :
                <MessageBox>No orders have been placed yet.</MessageBox>}
        </main>
    );
}
