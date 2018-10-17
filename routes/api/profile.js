
const express = require('express');
const router = express.Router();

// create and fetch the users profile
    // (location, bio, experiences, education, social network links)
    // Profile model and User's model

    
router.get('/test', (req, res) => res.json({msg: "Profile Wroks!"})
);

module.exports = router;
