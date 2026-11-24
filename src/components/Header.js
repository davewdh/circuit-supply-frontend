import React, { useEffect, useState } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import MemoryIcon from '@material-ui/icons/Memory';
import SearchIcon from '@material-ui/icons/Search';
import { signout } from '../actions/USerAction';
import '../styles/Header.css';

const categories = [
    ['accessories', 'Accessories'],
    ['monitor', 'Monitors'],
    ['laptop', 'Laptops'],
    ['earphones', 'Audio'],
];

const Header = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.userSignin);
    const [query, setQuery] = useState('');
    const [accountOpen, setAccountOpen] = useState(false);

    useEffect(() => {
        setAccountOpen(false);
    }, [location]);

    const search = event => {
        event.preventDefault();
        const term = query.trim();
        if (term) history.push('/searchresults/' + encodeURIComponent(term));
    };

    return (
        <header className="store-header">
            <div className="store-header-main">
                <Link className="store-brand" to="/">
                    <span className="store-brand-mark"><MemoryIcon aria-hidden="true" /></span>
                    <span>Circuit Supply</span>
                </Link>
                <form className="store-search" role="search" onSubmit={search}>
                    <SearchIcon aria-hidden="true" />
                    <input
                        aria-label="Search products"
                        placeholder="Search products"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                <div className="store-header-actions">
                    {userInfo ? (
                        <div className="store-account">
                            <button type="button" className="store-action" aria-label="Account"
                                aria-expanded={accountOpen} aria-controls="store-account-menu"
                                onClick={() => setAccountOpen(open => !open)}
                                onKeyDown={event => {
                                    if (event.key === 'Escape') setAccountOpen(false);
                                }}>
                                <AccountCircleOutlinedIcon aria-hidden="true" />
                                <span className="store-action-label">Account</span>
                            </button>
                            <div id="store-account-menu" className="store-account-menu" hidden={!accountOpen}>
                                <Link to="/profile">Profile</Link>
                                <Link to="/orderhistory">Order history</Link>
                                {userInfo.isAdmin && <Link to="/productlist">Manage products</Link>}
                                <Link to="/" onClick={() => dispatch(signout())}>Sign out</Link>
                            </div>
                        </div>
                    ) : (
                        <Link to="/signin" className="store-action" aria-label="Sign in">
                            <AccountCircleOutlinedIcon aria-hidden="true" />
                            <span className="store-action-label">Sign in</span>
                        </Link>
                    )}
                    <Link to="/cart" className="store-action" aria-label={'Cart, ' + cartItems.length + ' product types'}>
                        <ShoppingCartOutlinedIcon aria-hidden="true" />
                        <span className="store-action-label">Cart</span>
                        {cartItems.length > 0 && <span className="store-cart-count">{cartItems.length}</span>}
                    </Link>
                </div>
            </div>
            <nav className="store-categories" aria-label="Product categories">
                <NavLink exact to="/">All gear</NavLink>
                {categories.map(([slug, label]) => (
                    <NavLink key={slug} to={'/category/' + slug}>{label}</NavLink>
                ))}
            </nav>
        </header>
    );
};

export default Header;
