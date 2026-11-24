import React,{useEffect} from 'react'
import { useSelector , useDispatch} from 'react-redux'
import '../styles/ProductList.css'
import Product from './Product'
import LoadingBox from "./LoadingBox"
import MessageBox from "./MessageBox"
import { listProducts } from '../actions/ProdcutActions'

const ProductList = ({ title = 'Products', sectionId }) => {

    const dispatch = useDispatch();

    const productList = useSelector( state => state.productList);
    const {loading,error,products} = productList;


    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch])

    return (
        <section className="home-product-container" id={sectionId}>
            <h2 className="sec-title">{title}</h2>
            {loading ? <LoadingBox /> : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
                <p className="catalog-empty">No products are available right now.</p>
            ) : (
                <div className="product-container">
                    {products.map(product => <Product key={product._id} product={product} />)}
                </div>
            )}
        </section>
    );
};

export default ProductList;
