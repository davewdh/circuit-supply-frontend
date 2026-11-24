import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listOrderMine } from '../actions/OrderAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import OrderTable from '../components/OrderTable';

export default function OrderHistory() {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.orderMineList);

    useEffect(() => { dispatch(listOrderMine()); }, [dispatch]);

    return (
        <main className="orderhistory-container">
            <h1>Order history</h1>
            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> :
                orders?.length ? <OrderTable orders={orders} /> :
                <MessageBox>
                    You haven’t placed any orders yet. <Link className="rating-signin" to="/">Browse the catalog</Link>
                </MessageBox>}
        </main>
    );
}
