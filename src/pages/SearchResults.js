import React from 'react';
import CatalogResults from '../components/CatalogResults';

export default function SearchResults({ match }) {
    const { query } = match.params;
    const search = query.toLowerCase();
    return <CatalogResults key={query} title={`Search results for “${query}”`}
        matches={product => product.name.toLowerCase().includes(search)} />;
}
