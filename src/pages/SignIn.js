import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/USerAction';
import MessageBox from '../components/MessageBox';
import PasswordInput, { accountRedirect } from '../components/PasswordInput';

export default function SignIn({ location, history }) {
    const dispatch = useDispatch();
    const { userInfo, loading, error } = useSelector(state => state.userSignin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const redirect = accountRedirect(location.search);

    useEffect(() => {
        if (userInfo) history.replace(redirect);
    }, [history, redirect, userInfo]);

    return (
        <main className="signin-container">
            <form className="form" aria-busy={Boolean(loading)} onSubmit={event => {
                event.preventDefault();
                if (!loading) {
                    setSubmitted(true);
                    dispatch(signin(email.trim(), password));
                }
            }}>
                <h1>Sign in</h1>
                {submitted && error && <MessageBox variant="danger">{error}</MessageBox>}
                <div className="form-ip-sec">
                    <label htmlFor="signin-email">Email address</label>
                    <input id="signin-email" type="email" autoComplete="username" maxLength={254}
                        required value={email} onChange={event => { setEmail(event.target.value); setSubmitted(false); }} />
                </div>
                <PasswordInput id="signin-password" label="Password" autoComplete="current-password" required
                    value={password} onChange={value => { setPassword(value); setSubmitted(false); }} />
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
                <p className="new-user-register">New to Circuit Supply?
                    <Link to={'/register?redirect=' + encodeURIComponent(redirect)}>Create an account</Link>
                </p>
            </form>
        </main>
    );
}
