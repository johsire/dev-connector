
// authentication 
// login(username, email)
// passport

const express = require("express");
const router = express.Router();


router.get("/test", (req, res) => res.json({msg: "Users Wroks!"})
);

module.exports = router;
