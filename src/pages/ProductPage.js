import CatalogImage from '../components/CatalogImage';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsProduct } from '../actions/ProdcutActions';
import '../styles/ProductPage.css';

export default function ProductPage({ match, history }) {
    const dispatch = useDispatch();
    const productID = match.params.id;
    const { loading, error, product } = useSelector(state => state.productDetails);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
        dispatch(detailsProduct(productID));
    }, [dispatch, productID]);

    return (
        <main className="product-detail page-shell">
            <Link to="/" className="back-res">Shop all gear</Link>
            {loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox> : (
                <article className="product-detail-grid">
                    <div className="product-detail-image">
                        <CatalogImage src={product.image} alt={product.name} loading="eager" />
                    </div>
                    <div className="product-detail-info">
                        <p className="product-detail-category">{product.category}</p>
                        <h1>{product.name}</h1>
                        {product.numRev > 0 && <Rating rating={product.rating} numRev={product.numRev} />}
                        <p className="pd-price">${Number(product.price).toFixed(2)}</p>
                        <p className="product-detail-description">{product.description}</p>
                        <div className="product-purchase">
                            <p className={product.stock > 0 ? 'success' : 'error'}>
                                {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
                            </p>
                            {product.stock > 0 && (
                                <div className="product-purchase-actions">
                                    <label>Quantity
                                        <select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>
                                            {Array.from({ length: product.stock }, (_, index) => index + 1)
                                                .map(value => <option key={value}>{value}</option>)}
                                        </select>
                                    </label>
                                    <button className="store-primary" type="button"
                                        onClick={() => history.push(`/cart/${productID}?qty=${quantity}`)}>
                                        Add to cart
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            )}
        </main>
    );
}
