import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/ProdcutActions';
import { prices } from '../data/priceRanges';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import Product from './Product';
import '../styles/SearchResults.css';

export default function CatalogResults({ title, matches }) {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.productList);
    const [price, setPrice] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    const range = prices.find(option => String(option.id) === price)?.array;
    const results = (products || []).filter(product =>
        matches(product) && (!range || (product.price >= range[0] && product.price <= range[1]))
    );
    if (sort === 'low') results.sort((a, b) => a.price - b.price);
    if (sort === 'high') results.sort((a, b) => b.price - a.price);

    return (
        <main className="catalog-page">
            <h1>{title}</h1>
            <div className="catalog-toolbar">
                <label>Price
                    <select value={price} onChange={event => setPrice(event.target.value)}>
                        <option value="">Any price</option>
                        {prices.filter(option => option.id !== 0).map(option => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                </label>
                <label>Sort by
                    <select value={sort} onChange={event => setSort(event.target.value)}>
                        <option value="">Default</option>
                        <option value="low">Price, low to high</option>
                        <option value="high">Price, high to low</option>
                    </select>
                </label>
                {!loading && !error && <span role="status">{results.length} {results.length === 1 ? 'product' : 'products'}</span>}
            </div>
            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> :
                results.length ? (
                    <div className="product-container">
                        {results.map(product => <Product key={product._id} product={product} />)}
                    </div>
                ) : <MessageBox>No products match these filters.</MessageBox>}
        </main>
    );
}
