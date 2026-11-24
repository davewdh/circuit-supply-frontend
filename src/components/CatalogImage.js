import React from 'react';

export default function CatalogImage({ src, alt = '', loading = 'lazy' }) {
    const isCatalogImage = typeof src === 'string' && /^\/catalog\/[a-z-]+\.jpg$/.test(src);
    return <img src={isCatalogImage ? src : '/circuit-icon.png'} alt={alt} loading={loading} />;
}
