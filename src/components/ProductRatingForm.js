import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../Axios';

export default function ProductRatingForm({ productId, onSaved }) {
    const { userInfo } = useSelector(state => state.userSignin);
    const [score, setScore] = useState('');
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    if (!userInfo) {
        return <Link className="rating-signin"
            to={'/signin?redirect=/products/product/' + productId}>Sign in to rate this product</Link>;
    }

    async function saveRating(event) {
        event.preventDefault();
        setSaving(true);
        setNotice('');
        setError('');

        try {
            const { data } = await axios.put('/api/products/' + productId + '/rating',
                { score: Number(score) },
                { headers: { Authorization: 'Bearer ' + userInfo.token } });
            onSaved(data);
            setNotice('Your rating was saved.');
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to save your rating. Try again.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="product-rating-form" onSubmit={saveRating}>
            <label htmlFor="product-rating-score">Your rating</label>
            <div>
                <select id="product-rating-score" required value={score} onChange={event => setScore(event.target.value)}>
                    <option value="">Choose a rating</option>
                    {[5, 4, 3, 2, 1].map(value => (
                        <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>
                    ))}
                </select>
                <button className="store-primary" disabled={!score || saving}>
                    {saving ? 'Saving…' : 'Save rating'}
                </button>
            </div>
            {notice && <p role="status">{notice}</p>}
            {error && <p className="error" role="alert">{error}</p>}
        </form>
    );
}
