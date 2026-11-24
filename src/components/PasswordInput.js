import React, { useState } from 'react';

export const passwordRules = [
    ['At least 11 characters', value => [...value].length >= 11],
    ['An uppercase letter', value => /[A-Z]/.test(value)],
    ['A lowercase letter', value => /[a-z]/.test(value)],
    ['A number', value => /[0-9]/.test(value)],
    ['A special character', value => /[^\p{L}\p{N}\s]/u.test(value)],
];

export function checkNewPassword(value, confirmation) {
    if (typeof value !== 'string' || value !== confirmation) return 'Passwords do not match.';
    if (passwordRules.some(([, check]) => !check(value))) return 'Meet all five password requirements.';
    if (new Blob([value]).size > 72) return 'Password must use 72 UTF-8 bytes or fewer.';
    return '';
}

export function accountRedirect(search) {
    const path = new URLSearchParams(search).get('redirect');
    return path && /^\/(?![/\\])[^\\\s]*$/.test(path) ? path : '/';
}

export default function PasswordInput({ id, name, label, value, onChange, autoComplete, required, rules, error }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="form-ip-sec">
            <label htmlFor={id}>{label}</label>
            <div className="password-input">
                <input id={id} name={name} type={visible ? 'text' : 'password'} autoComplete={autoComplete}
                    value={value} onChange={event => onChange(event.target.value)} required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={[rules && id + '-rules', error && id + '-error'].filter(Boolean).join(' ') || undefined} />
                <button type="button" aria-controls={id} aria-label={(visible ? 'Hide ' : 'Show ') + label.toLowerCase()}
                    onClick={() => setVisible(open => !open)}>{visible ? 'Hide' : 'Show'}</button>
            </div>
            {rules && (
                <ul className="password-rules" id={id + '-rules'}>
                    {passwordRules.map(([label, check]) => {
                        const met = check(value);
                        return <li className={met ? 'met' : undefined} key={label}>
                            <span aria-hidden="true">{met ? '✓' : '○'}</span> {label}
                        </li>;
                    })}
                </ul>
            )}
            {error && <p className="account-field-error" id={id + '-error'} role="alert">{error}</p>}
        </div>
    );
}
