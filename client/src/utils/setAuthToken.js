import axios from 'axios';

const setAuthToken = token => {
    if(token){
        // Apply to every Request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete AuthHeader
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;