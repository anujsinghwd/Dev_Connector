import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import store from './store';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';

import './App.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// Check for tokens
if(localStorage.jwtToken){
  // Set uth Token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode Token gef user info from token
   const decoded = jwt_decode(localStorage.jwtToken);  
   // Set User and isAuthenticated
   store.dispatch(setCurrentUser(decoded))
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>  
          <Footer />
        </div>
        </Router>
        </Provider>
    );
  }
}

export default App;
