import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector} from 'react-redux';
import ProductList from '../../components/ProductList'

const AllProducts = () => {

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    if (!userInfo?.isAdmin) return <Redirect to="/" />;

    return (
        <div className="admin-orders-page-container">
            <div className="header-sec">
                <h2>Manage products</h2>
            </div>
            
            <ProductList/>
        </div>
    )
}

export default AllProducts
