const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Input Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
const validateProjectInput = require('../../validation/project');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load User Profile
const User = require('../../models/Users');

// @route   GET api/profile/test
// @dsec    Tests Profile route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: "profile works"});
});

// @route   GET api/profile/all
// @dsec    get all Profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({noprofile: 'There are no profiles'}));
});

// @route   GET api/profile
// @dsec    Get User Profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            } else {
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/handle/:handle
// @dsec    get Profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @dsec    get Profile by UserId
// @access  Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({noprofile: 'There is no profile for this user'}));
});

// @route   POST api/profile
// @dsec    Create / Edit User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills split into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile){
                // Update Profile
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile));
            } else{
                // Create Profile

                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        // Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        })
});

// @route   POST api/profile/experience
// @dsec    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // Add to experience array to profile
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
});

// @route   POST api/profile/education
// @dsec    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // Add to experience array to profile
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
});

// @route   POST api/profile/project
// @dsec    Add Projects to profile
// @access  Private
router.post('/project', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    if(!isValid){
        // Return any error with 400 status
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newProj = {
                title: req.body.title,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                projectUrl: req.body.projectUrl,
                description: req.body.description
            }

            // Add to experience array to profile
            profile.project.unshift(newProj);
            profile.save().then(profile => res.json(profile));
        })
});


// @route   DELETE api/profile/project/:proj_id
// @dsec    DELETE project from profile
// @access  Private
router.delete('/project/:proj_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Profile.findOne({user: req.user.id})
        .then(profile => {
            // Get Remove Index
            const removeIndex = profile.project
                                    .map(item => item.id)
                                    .indexOf(req.params.proj_id);
            
            // Splice out of array
            profile.project.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
});

// @route   DELETE api/profile/experience/:exp_id
// @dsec    DELETE experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Profile.findOne({user: req.user.id})
        .then(profile => {
            // Get Remove Index
            const removeIndex = profile.experience
                                    .map(item => item.id)
                                    .indexOf(req.params.exp_id);
            
            // Splice out of array
            profile.experience.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
});

// @route   DELETE api/profile/education/:edu_id
// @dsec    DELETE education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Profile.findOne({user: req.user.id})
        .then(profile => {
            // Get Remove Index
            const removeIndex = profile.education
                                    .map(item => item.id)
                                    .indexOf(req.params.exp_id);
            
            // Splice out of array
            profile.education.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
});


// @route   DELETE api/profile
// @dsec    DELETE user
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({user: req.user.id})
        .then(() => {
            User.findOneAndRemove({_id: req.user.id})
                .then(() => {
                    res.json({success: true});
                })
        })
});

module.exports = router;