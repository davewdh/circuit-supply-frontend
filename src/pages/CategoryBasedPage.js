import React from 'react';
import CatalogResults from '../components/CatalogResults';

const categoryNames = {
    accessories: 'Accessories',
    monitor: 'Monitors',
    laptop: 'Laptops',
    earphones: 'Audio',
    mobile: 'Mobile',
};

export default function CategoryBasedPage({ match }) {
    const category = match.params.cat.toLowerCase();
    return <CatalogResults key={category} title={categoryNames[category] || 'Category'}
        matches={product => product.category.toLowerCase().includes(category)} />;
}
