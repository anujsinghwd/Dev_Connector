
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';

import './App.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { clearProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';

// Check for tokens
if(localStorage.jwtToken){
  // Set uth Token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode Token gef user info from token
   const decoded = jwt_decode(localStorage.jwtToken);  
   // Set User and isAuthenticated
   store.dispatch(setCurrentUser(decoded));

   // Check for expired token
   const currentTime = Date.now()/1000;
   if(decoded.exp < currentTime){
      store.dispatch(logoutUser()); 
      // clear current profile
      store.dispatch(clearProfile());
      // Redirect to login
      window.location.href = '/login';

   }
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
            <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              </Switch>
          </div>  
          <Footer />
        </div>
        </Router>
        </Provider>
    );
  }
}

export default App;
