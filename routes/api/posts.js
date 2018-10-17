
const express = require('express');
const router = express.Router();

// Users will be able to create posts and comments

router.get('/test', (req, res) => res.json({ msg: "Posts Wroks!" })
);

module.exports = router;
