import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from '../Axios';
import { saveShippingAddress } from '../actions/CartAction';
import CheckoutSteps from '../components/CheckoutSteps';
import MessageBox from '../components/MessageBox';

const shippingFields = [
    { name: 'fullName', label: 'Full name', autoComplete: 'shipping name', maxLength: 100 },
    { name: 'address', label: 'Street address', autoComplete: 'shipping address-line1', maxLength: 150 },
    { name: 'addressLine2', label: 'Apartment or suite (optional)', autoComplete: 'shipping address-line2', maxLength: 80 },
    { name: 'city', label: 'City or town', autoComplete: 'shipping address-level2', maxLength: 100 },
    { name: 'region', label: 'Province, territory, or state', autoComplete: 'shipping address-level1', maxLength: 100 },
    { name: 'postalcode', label: 'Postal or ZIP code', autoComplete: 'shipping postal-code', maxLength: 20 },
    { name: 'country', label: 'Country', autoComplete: 'shipping country-name', maxLength: 100 },
];

export default function ShippingAddress({ history }) {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userSignin);
    const { shippingAddress } = useSelector(state => state.cart);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    if (!userInfo) return <Redirect to="/signin?redirect=/shipping" />;

    async function submit(event) {
        event.preventDefault();
        if (pending) return;
        setError('');
        setFieldErrors({});
        const address = Object.fromEntries(new FormData(event.currentTarget));
        setPending(true);
        try {
            const { data } = await axios.post('/api/orders/shipping-address', { shippingAddress: address }, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(saveShippingAddress(data.address));
            history.push('/payment');
        } catch (error) {
            const response = error.response?.data;
            setError(response?.message || 'We couldn’t check the address. Try again.');
            setFieldErrors(response?.fields || {});
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <CheckoutSteps step1 step2 />
            <main className="shipping-form-container">
                <form className="form" onSubmit={submit} aria-busy={pending}>
                    <h1>Shipping address</h1>
                    {error && <MessageBox variant="danger">{error}</MessageBox>}
                    <fieldset className="shipping-fields" disabled={pending}>
                        {shippingFields.map(({ name, label, autoComplete, maxLength }) => {
                            const id = 'shipping-' + name;
                            const issue = fieldErrors[name];
                            return (
                                <div className="form-ip-sec" key={name}>
                                    <label htmlFor={id}>{label}</label>
                                    <input id={id} name={name} autoComplete={autoComplete} maxLength={maxLength}
                                        defaultValue={shippingAddress?.[name] || ''}
                                        aria-invalid={issue ? true : undefined}
                                        aria-describedby={issue ? id + '-error' : name === 'region' ? 'shipping-region-hint' : undefined}
                                        onChange={() => setFieldErrors(errors => ({ ...errors, [name]: undefined }))} />
                                    {name === 'region' && <p className="order-payment-note" id="shipping-region-hint">
                                        Enter the full name or abbreviation, such as Ontario or ON.
                                    </p>}
                                    {issue && <p className="account-field-error" id={id + '-error'}>{issue}</p>}
                                </div>
                            );
                        })}
                    </fieldset>
                    <button type="submit" className="continue-btn" disabled={pending}>
                        {pending ? 'Checking address…' : 'Continue'}
                    </button>
                </form>
            </main>
        </>
    );
}
