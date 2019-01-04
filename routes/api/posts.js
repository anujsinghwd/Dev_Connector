const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const Post = require('../../models/Post');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load Validator
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @dsec    Tests Post route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: "post works"});
});

// @route   POST api/posts
// @dsec    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }),(req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
     newPost.save().then(post => res.json(post));
});

// @route   GET api/posts
// @dsec    Read Posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json({nopostfound: 'no post found'}));
});

// @route   GET api/posts/:id
// @dsec    Read Single Posts
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id) 
        .then(post => res.json(post))
        .catch(err => res.status(400).json({nopostfound: 'no post found with that ID'}));
});

// @route   DELETE api/posts/:id
// @dsec    DELETE post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.json(401).json({notauthorized: 'User not authorized'});
                    }

                    // Delete
                    post.remove().then(()=> res.json({success: true}))
                                .catch(err => res.status(404).json({postnotfound: 'Post not found'}));
                })
        })
});

// @route   POST api/posts/like/:id
// @dsec    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        return res.status(400).json({ alreadyliked: 'User already liked this post' });
                    }

                    // Add userId to likes array
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                })
        });
});

// @route   POST api/posts/unlike/:id
// @dsec    DisLike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(400).json({ notliked: 'You have not yet liked this post' });
                    }

                    // get remove index
                    const removeIndex = post.likes
                                            .map(item => item.user.toString())
                                            .indexOf(req.user.id);
                    
                    // Splice the array
                    post.likes.splice(removeIndex, 1);

                    // Save the action
                    post.save().then( post => res.json(post));
                })
        });
});

// @route   POST api/posts/comment/:id
// @dsec    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }

     Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
             // Add to comments array
             post.comments.unshift(newComment);

             //save post
             post.save().then(post => res.json(post)); 
        })
        .catch(err => res.status(404).json({postnotfount: 'No post found'}));
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @dsec    Delete comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

     Post.findById(req.params.id)
        .then(post => {
            // Check to see if the comment is exists
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id) === 0){
                return res.status(404).json({ commentnotexists: 'Comment does not exists' });
            }
            
            // Get the remove index
            const removeIndex = post.comments
                                    .map(item => item._id.toString())
                                    .indexOf(req.params.comment_id);
            
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({postnotfount: 'No post found'}));
});

module.exports = router;