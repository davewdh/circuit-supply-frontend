import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/USerAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import PasswordInput, { checkNewPassword } from '../components/PasswordInput';
import { USER_UPDATE_PROFILE_RESET } from '../constants/UserConstant';

export default function UserProfile() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userSignin);
    const { loading, error, user } = useSelector(state => state.userDetails);

    useEffect(() => {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(detailsUser(userInfo._id));
    }, [dispatch, userInfo._id]);

    return (
        <main className="user-dets-container">
            {error ? <MessageBox variant="danger">{error}</MessageBox> :
                loading || user?._id !== userInfo._id ? <LoadingBox /> : <ProfileForm user={user} />}
        </main>
    );
}

function ProfileForm({ user }) {
    const dispatch = useDispatch();
    const { success, loading, error } = useSelector(state => state.userUpdateProfile);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [fieldError, setFieldError] = useState('');

    useEffect(() => {
        if (success) {
            setPassword('');
            setConfirmation('');
        }
    }, [success]);

    function submit(event) {
        event.preventDefault();
        if (loading) return;
        const issue = password || confirmation ? checkNewPassword(password, confirmation) : '';
        setFieldError(issue);
        if (!issue) dispatch(updateUserProfile({ name: name.trim(), email: email.trim(), password }));
    }

    return (
        <form className="form" aria-busy={Boolean(loading)} onSubmit={submit}
            onChange={() => {
                setFieldError('');
                if (success || error) dispatch({ type: USER_UPDATE_PROFILE_RESET });
            }}>
            <h1>Your profile</h1>
            {error && <MessageBox variant="danger">{error}</MessageBox>}
            {success && <MessageBox variant="success">Profile updated.</MessageBox>}
            <div className="form-ip-sec">
                <label htmlFor="profile-name">Full name</label>
                <input id="profile-name" autoComplete="name" required maxLength={100}
                    value={name} onChange={event => setName(event.target.value)} />
            </div>
            <div className="form-ip-sec">
                <label htmlFor="profile-email">Email address</label>
                <input id="profile-email" type="email" autoComplete="email" required maxLength={254}
                    value={email} onChange={event => setEmail(event.target.value)} />
            </div>
            <p className="order-payment-note">Leave the password fields blank to keep your current password.</p>
            <PasswordInput id="profile-password" label="New password" autoComplete="new-password"
                rules={Boolean(password)} value={password} onChange={setPassword}
                error={fieldError !== 'Passwords do not match.' ? fieldError : undefined} />
            <PasswordInput id="profile-confirmation" label="Confirm new password" autoComplete="new-password"
                value={confirmation} onChange={setConfirmation}
                error={fieldError === 'Passwords do not match.' ? fieldError : undefined} />
            <button className="update-btn" type="submit" disabled={loading}>
                {loading ? 'Saving changes…' : 'Save changes'}
            </button>
        </form>
    );
}
