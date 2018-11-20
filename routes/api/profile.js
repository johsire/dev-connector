// create and fetch the users profile
// (location, bio, experiences, education, social network links)
// Profile model and User's model

// Load Validation // -->----------------------------------->>>>
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//-----------> Installed Dependencies--------------------------------->
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//-------------------> Load Profile Model----------------->
const Profile = require('../../models/Profile');

//-------------------> Load User Profile------------------>
const User = require('../../models/User');

// @header  --------------------> Our Routes---------------------->
// @route   GET: api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) =>
	res.json({
		msg: 'Profile Works!',
	})
);

// @header  ---------------> GET/ Get Current User Profile --------------->
// @route   GET: api/profile
// @desc    Get Current User Profile
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', {
		session: false,
	}),
	(req, res) => {
		const errors = {};

		Profile.findOne({
			user: req.user.id,
		})
			.then(profile => {
				if (!profile) {
					errors.noprofile = 'There is no profile for this user';
					return res.status(404).json(errors);
				}
				res.json(profile);
			})
			.catch(err => res.status(404).json(err));
	}
);

// @header  ---------------> GET/ Get All Profiles --------------------->
// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
	const errors = {};

	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles';
				return res.status(404).json(errors);
			}

			res.json(profiles);
		})
		.catch(err => res.status(404).json({ profile: 'There is no profiles' }));
});

// @header  ---------------> GET/ Get Profile by handle ------------------------>
// @route   GET: api/profile/handle/:handle
// @desc    Get Profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
	const errors = {};

	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @header  ---------------> GET/ Get Profile by User ID -------------------------------------->
// @route   GET: api/profile/user/:user_id
// @desc    Get Profile by User ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err =>
			res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @header  ---------------> POST/ Create or Edit New User Profile ------------->
// @route   POST: api/profile
// @desc    Create or Edit User Profile
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', {
		session: false,
	}),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Check Validation
		if (!isValid) {
			// Return any errors with 400 status
			return res.status(400).json(errors);
		}

		// Get Fileds ------------------------------------------------->
		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

		// Skills - Split inito an array --------------------------------------------------->
		if (typeof req.body.skills !== 'undefined') {
			profileFields.skills = req.body.skills.split(',');
		}

		// Social Media Connections ---------------------------------------------------------->
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		// Search for the user using the user-id ----------------------------------------------->
		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// Update (if they have a profile we update using the below code) -------------------------------------->
				Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(profile =>
					res.json(profile)
				);
			} else {
				// Check if handle w/ same name exists: Throw an err if the handle name exists; ------------------------->
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = 'That handle already exisits';
						res.status(400).json(errors);
					}

					// Create the new handle/ user profile if the handle name is NOT found; -------------->
					// Save New Profile ------------------------------------------------------------------->
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		});
	}
);

// @header  ---------------> POST/ Add Experience to User Profile --------------------------->
// @route   POST api/profile/experience
// @desc    Add experience to user profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateExperienceInput(req.body);

	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors);
	}

	Profile.findOne({ user: req.user.id })
		.then(profile => {
		const newExp = {
			title: req.body.title,
			company: req.body.company,
			location: req.body.location,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			description: req.body.description,
		};

		// Add to Experience Array
		profile.experience.unshift(newExp);

		profile.save().then(profile => res.json(profile));
	});
});

// @header  --------------> POST/ Add Education to User Profile ------------------------------->
// @route   POST api/profile/education
// @desc    Add education to user profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateEducationInput(req.body);

	// Check Validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors);
	}

	Profile.findOne({ user: req.user.id })
		.then(profile => {
		const newEdu = {
			school: req.body.school,
			degree: req.body.degree,
			fieldofstudy: req.body.fieldofstudy,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			description: req.body.description
		};

		// Add to Experience Array
		profile.education.unshift(newEdu);

		profile.save().then(profile => res.json(profile));
	});
});

// @header  ----------> DELETE/ Delete Experience from User Profile -------------------------------->
// @route   DELETE api/profile/experience/"exp_id"
// @desc    Delete experience from user profile
// @access  Private
router.delete('/experience/:exp_id',
	passport.authenticate('jwt', { session: false }), (req, res) => {

		Profile.findOne({ user: req.user.id })
			.then(profile => {
		// Get remove index
				const removeIndex = profile.experience
					.map(item => item.id)
					.indexOf(req.params.exp_id);

		// Splice out of Array
		profile.experience.splice(removeIndex, 1);

		// Save
		profile.save().then(profile => res.json(profile));
	});
	});

// @header  ----------> DELETE/ Delete Education from User Profile -------------------------------->
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from user profile
// @access  Private
router.delete('/education/:edu_id',
passport.authenticate('jwt', { session: false }), (req, res) => {

	Profile.findOne({ user: req.user.id })
		.then(profile => {
	// Get remove index
			const removeIndex = profile.education
				.map(item => item.id)
				.indexOf(req.params.edu_id);

	// Splice out of Array
	profile.education.splice(removeIndex, 1);

	// Save
	profile.save().then(profile => res.json(profile));
});
});

module.exports = router;
