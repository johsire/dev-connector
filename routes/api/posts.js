// Users will be able to create posts and comments

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// @route   GET: api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) =>
	res.json({
		msg: 'Posts Works!',
	})
);

// @route POST api/posts 
// @desc Create Post   
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});
});

module.exports = router;
