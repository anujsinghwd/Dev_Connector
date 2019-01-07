import React, { Component } from 'react';
import { Link,  withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import { connect } from 'react-redux';
import PropTypes  from 'prop-types';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addWork } from '../../actions/profileActions';

class AddWork extends Component {

  constructor(props){
    super(props);
    this.state = {
      title: '',
      from: '',
      to: '',
      current: false,
      description: '',
      errors: {},
      projectUrl: '',
      disabled: false
    }
    this.onChange = this.onChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors: nextProps.errors});
    }
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  onCheck(){
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current
    });
  }

  onSubmit(e){
    e.preventDefault();
    const workData = {
      title: this.state.title,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      projectUrl: this.state.projectUrl,
      description: this.state.description
    }

    this.props.addWork(workData, this.props.history);
  }

  render() {

    const { errors } = this.state;

    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Work</h1>
              <p className="lead text-center">Add any school, bootcamp, collage projects etc</p>
              <small className="d-block pb-3">* required field</small>
              <form onSubmit={this.onSubmit.bind(this)}>
                <TextFieldGroup
                  placeholder="* Project Title"
                  name="title"
                  onChange={this.onChange}
                  error={errors.title}
                />

                <TextFieldGroup
                  placeholder="Project Url"
                  name="projectUrl"
                  onChange={this.onChange}
                  value={this.state.projectUrl}
                  error={errors.projectUrl}
                />

                <h6>From Date</h6>
                <TextFieldGroup
                  placeholder="* From Date"
                  name="from"
                  type="date"
                  onChange={this.onChange}
                  error={errors.from}

                />

                <h6>To Date</h6>
                <TextFieldGroup
                  placeholder="* To Date"
                  name="to"
                  type="date"
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id="current"
                  />
                  <label className="form-check-label" htmlFor="current">
                    Currently Ongoing
                  </label>
                </div>

                <TextAreaFieldGroup
                  placeholder="Project Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell us about your experience and what you learned"
                />
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AddWork.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    addWork: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})
export default connect(mapStateToProps, { addWork })(withRouter(AddWork));
