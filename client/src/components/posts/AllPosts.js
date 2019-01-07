import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { getPosts } from '../../actions/postActions';
import PostFeed from './PostFeed';

class AllPosts extends Component {

  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.post;
    let allPosts;

    if (posts === null || loading) {
      allPosts = <Spinner />;
    } else {
      allPosts = <PostFeed posts={posts} />;
    }

    return (
      <div>
        {allPosts}
      </div>
    )
  }
}

AllPosts.proptypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(AllPosts);