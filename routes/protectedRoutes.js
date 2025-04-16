const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected Route
router.get("/", authMiddleware, (req, res) => {
    res.json({ message: "Protected content", user: req.user });
});


router.get("/yourrooms",authMiddleware,(req,res)=>{
    res.send("PROTECTED PAGE FOR LANDLORDS <ROOMS>")
} )
module.exports = router;
