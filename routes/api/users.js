
const express = require('express');
const router = express.Router();


// authentication 
// login(username, email)
// passport


router.get('/test', (req, res) => res.json({msg: "Users Wroks!"})
);

module.exports = router;
