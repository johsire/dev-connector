
// create and fetch the users profile
    // (location, bio, experiences, education, social network links)
    // Profile model and User's model
    
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({msg: "Profile Works!"})
);

module.exports = router;
