import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import heroImage from '../data/storefront-hero.jpg';
import '../styles/Home.css';

const collections = [
    { name: 'Desk essentials', path: 'accessories', image: '/catalog/keyboard.jpg' },
    { name: 'Displays', path: 'monitor', image: '/catalog/monitor.jpg' },
    { name: 'Personal audio', path: 'earphones', image: '/catalog/headphones.jpg' },
];

const Home = () => (
    <main className="home-page-container">
        <section className="storefront-hero" aria-labelledby="storefront-title">
            <img className="storefront-hero-image" src={heroImage} alt="" />
            <div className="storefront-hero-content">
                <h1 id="storefront-title">Build a better desk.</h1>
                <p>Keyboards, displays, audio, and accessories for your everyday setup.</p>
                <a className="storefront-hero-button" href="#catalog">Explore the catalog</a>
            </div>
        </section>
        <section className="store-collections" aria-labelledby="collection-title">
            <h2 id="collection-title" className="sec-title">Shop by category</h2>
            <div className="store-collection-grid">
                {collections.map(collection => (
                    <Link key={collection.path} to={'/category/' + collection.path} className="store-collection">
                        <img src={collection.image} alt="" loading="lazy" />
                        <span>{collection.name}</span>
                    </Link>
                ))}
            </div>
        </section>
        <ProductList title="The catalog" sectionId="catalog" />
    </main>
);

export default Home;
