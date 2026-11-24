import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import axios from './Axios';
import { addToCart } from './actions/CartAction';
import { signout } from './actions/USerAction';
import Register from './pages/Register';
import { cartReducer, emptyCart } from './reducers/CartReducer';
import { userRegisterReducer, userSigninReducer } from './reducers/UserReducer';

jest.mock('./Axios');

const reducer = combineReducers({
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
});
const createTestStore = state => createStore(reducer, state, applyMiddleware(thunk));

afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

test('registration rejects different passwords and submits matching confirmation', async () => {
    axios.post.mockResolvedValue({ data: { _id: 'test-account' } });
    render(
        <Provider store={createTestStore()}>
            <MemoryRouter initialEntries={['/register']}>
                <Route path="/register" component={Register} />
            </MemoryRouter>
        </Provider>
    );
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.test' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input', exact: true }),
        { target: { value: 'Abcdefghi1!' } });
    const confirmation = screen.getByLabelText('Confirm password', { selector: 'input', exact: true });
    fireEvent.change(confirmation, { target: { value: 'Zbcdefghi1!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert').textContent).toBe('Passwords do not match.');
    expect(axios.post).not.toHaveBeenCalled();

    fireEvent.change(confirmation, { target: { value: 'Abcdefghi1!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/users/register', {
        name: 'Test User', email: 'test@example.test', password: 'Abcdefghi1!',
        passwordConfirmation: 'Abcdefghi1!',
    }));
});

test('sign-out clears checkout state and ignores a cart request already in flight', async () => {
    let completeRequest;
    axios.get.mockReturnValue(new Promise(resolve => { completeRequest = resolve; }));
    const cart = { cartItems: [{ product: 'saved' }], shippingAddress: { city: 'Toronto' }, paymentMethod: 'Other' };
    const store = createTestStore({ cart, userSignin: { userInfo: { _id: 'test-account' } } });
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems));
    localStorage.setItem('shippingAddress', JSON.stringify(cart.shippingAddress));

    const pending = store.dispatch(addToCart('late', 1));
    store.dispatch(signout());
    completeRequest({ data: { _id: 'late' } });
    await pending;

    expect(store.getState().cart).toEqual(emptyCart);
    expect(localStorage.getItem('cartItems')).toBeNull();
    expect(localStorage.getItem('shippingAddress')).toBeNull();
});
