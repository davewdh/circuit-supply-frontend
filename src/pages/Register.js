import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/USerAction';
import MessageBox from '../components/MessageBox';
import PasswordInput, { accountRedirect, checkNewPassword } from '../components/PasswordInput';

export default function Register({ location, history }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.userRegister);
    const { userInfo } = useSelector(state => state.userSignin);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const redirect = accountRedirect(location.search);

    useEffect(() => {
        if (userInfo) history.replace(redirect);
    }, [history, redirect, userInfo]);

    function submit(event) {
        event.preventDefault();
        if (loading) return;
        setSubmitted(false);
        const issue = checkNewPassword(password, confirmation);
        setFieldError(issue);
        if (issue) return;
        setSubmitted(true);
        dispatch(register(name.trim(), email.trim(), password));
    }

    return (
        <main className="register-container">
            <form className="form" aria-busy={Boolean(loading)} onSubmit={submit}
                onChange={() => { setFieldError(''); setSubmitted(false); }}>
                <h1>Create an account</h1>
                {submitted && error && <MessageBox variant="danger">{error}</MessageBox>}
                <div className="form-ip-sec">
                    <label htmlFor="register-name">Full name</label>
                    <input id="register-name" autoComplete="name" maxLength={100} required
                        value={name} onChange={event => setName(event.target.value)} />
                </div>
                <div className="form-ip-sec">
                    <label htmlFor="register-email">Email address</label>
                    <input id="register-email" type="email" autoComplete="username" maxLength={254} required
                        value={email} onChange={event => setEmail(event.target.value)} />
                </div>
                <PasswordInput id="register-password" label="Password" autoComplete="new-password"
                    required rules value={password} onChange={setPassword}
                    error={fieldError !== 'Passwords do not match.' ? fieldError : undefined} />
                <PasswordInput id="register-confirmation" label="Confirm password" autoComplete="new-password"
                    required value={confirmation} onChange={setConfirmation}
                    error={fieldError === 'Passwords do not match.' ? fieldError : undefined} />
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                </button>
                <p className="new-user-register">Already have an account?
                    <Link to={'/signin?redirect=' + encodeURIComponent(redirect)}>Sign in</Link>
                </p>
            </form>
        </main>
    );
}
