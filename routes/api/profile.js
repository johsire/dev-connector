
// create and fetch the users profile
    // (location, bio, experiences, education, social network links)
    // Profile model and User's model

const express = require("express");
const router = express.Router();

// @route   GET: api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works!" }));

module.exports = router;
