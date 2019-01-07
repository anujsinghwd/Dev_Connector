import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteWork } from '../../actions/profileActions';

class Work extends Component {

  onDeleteClick(id){
    this.props.deleteWork(id);
  }

  render() {

    const works = this.props.projects.map(w => (
        <tr key={w._id}>
            <td>{w.title}</td>
            <td>{w.title}</td>
            <td>
                <Moment format="YYYY-MM-DD">{w.from}</Moment>{' - '}
                { w.to === null ? ('Now') : (<Moment format="YYYY-MM-DD">{w.to}</Moment>) }
            </td>

            <td>
              <button onClick={this.onDeleteClick.bind(this, w._id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>
    ));

    return (
        <div>
        <h4 className="mb-4">Work Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Title</th>
              <th>Years</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {works}
          </tbody>
        </table>
      </div>
    )
  }
}

Work.propTypes = {
    deleteWork: PropTypes.func.isRequired
}

export default connect(null, { deleteWork })(Work);
