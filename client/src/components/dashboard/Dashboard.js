import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import  ProfileActions  from "./ProfileActions";
import Experience from './Experience';
import Education from './Education';
import Work from './Work';

class Dashboard extends Component {

  componentDidMount(){
      this.props.getCurrentProfile();
  }

  onDeleteClick(e){
    this.props.deleteAccount();
  }

  render() {

    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if(profile === null || loading){
      dashboardContent = <Spinner />
    } else {
      // Check if logged user has profile data
      if(Object.keys(profile).length > 0){
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link to={`profile/${profile.handle}`}>{user.name}</Link></p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <Work projects={profile.project} />
            <div style={{ marginBottom: '60px' }} />
            <button onClick={this.onDeleteClick.bind(this)} className="btn btn-danger">Delete My Account</button>
          </div>
        );
      } else {
        // User is logged In has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p> You have not set up profile , please add some Info </p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
               Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
          <div className="col-md-12">
            <h1 className="display-4"></h1>
             { dashboardContent }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.proptypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProp = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProp, { getCurrentProfile, deleteAccount })(Dashboard);
