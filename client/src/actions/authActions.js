import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register User

export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data 
            })
        );
}

// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // Save to localstorage
            const { token } = res.data;

            // Set Token to localstorage
            localStorage.setItem('jwtToken', token);
            // Set Token to AuthHeader
            setAuthToken(token);
            // Decode Token to get user info
            const decode = jwt_decode(token);
            // Set Current User
            dispatch(setCurrentUser(decode));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data 
            })
        );
}

// Set Logged In User
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

 // Logout User
 export const logoutUser = () => dispatch => {
     // Remove the token from localstorage
     localStorage.removeItem('jwtToken');
     // Remove the auth Header for future request
     setAuthToken(false);
     // Set the current to an empty object which will also set authenticated is also false
     dispatch(setCurrentUser({}));
 }
