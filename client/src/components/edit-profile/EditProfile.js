import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is_empty';

class EditProfile extends Component {

  constructor(props){
      super(props);
      this.state = {
           displaySocialInput: false,
           handle: '',
           company: '',
           website: '',
           location: '',
           status: '',
           skills: '',
           githubusername: '',
           bio: '',
           twitter: '',
           facebook: '',
           linkedin: '',
           instagram: '',
           youtube: '',
           errors: {} 
      }
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  componentDidMount(){
      this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.errors){
          this.setState({errors: nextProps.errors});
      }

      if(nextProps.profile.profile){
           const profile = nextProps.profile.profile;
           
           // bring Skills array back to comma separated values
           const skillsCSV = profile.skills.join(',');
           
           // If profile field doesn't exixts add or make empty string
           profile.company = !isEmpty(profile.company) ? profile.company : '';
           profile.website = !isEmpty(profile.website) ? profile.website : '';
           profile.location = !isEmpty(profile.location) ? profile.location : '';
           profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
           profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
           profile.social = !isEmpty(profile.social) ? profile.social : {};
           profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
           profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
           profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';
           profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
           profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';

           // Set components field to state
           this.setState({
                handle: profile.handle,
                company: profile.company,
                website: profile.website,
                location: profile.location,
                status: profile.status,
                skills: skillsCSV,
                githubusername: profile.githubusername,
                bio: profile.bio,
                twitter: profile.twitter,
                facebook: profile.facebook,
                linkedin: profile.linkedin,
                instagram: profile.instagram,
                youtube: profile.youtube,
           });
      }
  }

  socialStateChange(e) {
    e.preventDefault();
        this.setState(prevState => ({
            displaySocialInput: !prevState.displaySocialInput
        })
    )
}

  onSubmit(e){
    e.preventDefault();
    const profileData = {
           handle: this.state.handle,
           company: this.state.company,
           website: this.state.website,
           location: this.state.location,
           status: this.state.status,
           skills: this.state.skills,
           githubusername: this.state.githubusername,
           bio: this.state.bio,
           twitter: this.state.twitter,
           facebook: this.state.facebook,
           linkedin: this.state.linkedin,
           instagram: this.state.instagram,
           youtube: this.state.youtube,
    }
    this.props.createProfile(profileData, this.props.history);
  }

  render() {

    const { errors, displaySocialInput } = this.state;

    let socialInputs;
    if(displaySocialInput){
        socialInputs = (
            <div className="">
                <InputGroup 
                    placeholder="twiiter profile URL"
                    name="twitter"
                    icon="fab fa-twitter"
                    value={this.state.twitter}
                    onChange={this.onChange}
                    error={errors.twitter}
                />

                <InputGroup 
                    placeholder="facebook profile URL"
                    name="facebook"
                    icon="fab fa-facebook"
                    value={this.state.facebook}
                    onChange={this.onChange}
                    error={errors.facebook}
                />

                <InputGroup 
                    placeholder="youtube profile URL"
                    name="youtube"
                    icon="fab fa-youtube"
                    value={this.state.youtube}
                    onChange={this.onChange}
                    error={errors.youtube}
                />

                <InputGroup 
                    placeholder="linkedin profile URL"
                    name="linkedin"
                    icon="fab fa-linkedin"
                    value={this.state.linkedin}
                    onChange={this.onChange}
                    error={errors.linkedin}
                />

                <InputGroup 
                    placeholder="instagram profile URL"
                    name="instagram"
                    icon="fab fa-instagram"
                    value={this.state.instagram}
                    onChange={this.onChange}
                    error={errors.instagram}
                />
            </div>
        );
    }

    // Select options for status
    const options = [
        {
            label: '* Select professional status',
            value: 0
        },
        {
            label: 'Developer',
            value: 'Developer'
        },
        {
            label: 'Sr. Developer',
            value: 'Sr. Developer'
        },
        {
            label: 'Jr. Developer',
            value: 'Jr. Developer'
        },
        {
            label: 'Student',
            value: 'Student'
        },
        {
            label: 'Manager',
            value: 'Manager'
        },
        {
            label: 'Intern',
            value: 'Intern'
        }
    ];

    return (
      <div className="create-profile">
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Edit Profile</h1>
                    <small className="d-block pd-3">* required fields</small>
                    <form onSubmit={this.onSubmit}>
                        <TextFieldGroup 
                            placeholder="* Profile handle"
                            name="handle"
                            value={this.state.handle}
                            onChange={this.onChange}
                            error={errors.handle}
                            info="A unique handle for your profile URL, Your full name , company name , nickname, etc(This CAN'T be changed later)"
                        />

                        <SelectListGroup 
                            placeholder = "Status"
                            name = "status"
                            value = {this.state.status}
                            onChange = {this.onChange}
                            error = { errors.status }
                            options = {options}
                            info="Give us an idea of where you are at in oyur carrier"
                        />

                        <TextFieldGroup 
                            placeholder="Company"
                            name="company"
                            value={this.state.company}
                            onChange={this.onChange}
                            error={errors.company}
                            info="Could be your company or where you work"
                        />

                        <TextFieldGroup 
                            placeholder="Website"
                            name="website"
                            value={this.state.website}
                            onChange={this.onChange}
                            error={errors.website}
                            info="Could be your website or company one"
                        />

                        <TextFieldGroup 
                            placeholder="Location"
                            name="location"
                            value={this.state.location}
                            onChange={this.onChange}
                            error={errors.location}
                            info="City or city & state suggested (eg. Delhi, UP)"
                        />

                        <TextFieldGroup 
                            placeholder="Skills"
                            name="skills"
                            value={this.state.skills}
                            onChange={this.onChange}
                            error={errors.skills}
                            info="Please use comma seperated values (eg. HTML,CSS,PHP)"
                        />

                        <TextFieldGroup 
                            placeholder="Github Username"
                            name="githubusername"
                            value={this.state.githubusername}
                            onChange={this.onChange}
                            error={errors.githubusername}
                            info="If you want your latest repos and a Github link , include your username"
                        />

                        <TextFieldGroup 
                            placeholder="Short bio"
                            name="bio"
                            value={this.state.bio}
                            onChange={this.onChange}
                            error={errors.bio}
                            info="Tell us a little about yourself"
                        />

                        <div className="mb-3">
                            <button onClick={this.socialStateChange.bind(this)} className="btn btn-light">
                             Add Social Network Links
                            </button>
                            <span className="text-muted">Optional</span>
                        </div>
                          {socialInputs}
                          <input type="submit" value="submit" className="btn btn-info btn-block mt-4" />      
                    </form>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

EditProfile.proptypes = {
    createProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, { EditProfile, getCurrentProfile, createProfile })(withRouter(EditProfile));
