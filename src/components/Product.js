import CatalogImage from './CatalogImage';
import React from 'react'
import Rating from './Rating'
import "../styles/Product.css"
import { Link } from 'react-router-dom'


const Product = ({product}) => {

    return (
        <Link className="product-card-link" to={`/products/product/${product._id}`}>
        <div className="product-card" >
            <div className="product-image">
                <CatalogImage src={product.image} />
            </div>
            <h2>{product.name}</h2>
            {product.numRev > 0 && <Rating rating={product.rating} numRev={product.numRev} />}
            <p>${Number(product.price).toFixed(2)}</p>
        </div>
        </Link>
    )
}

export default Product
