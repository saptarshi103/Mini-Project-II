const express = require("express");
const axios = require("axios");
const qs = require("querystring");

const router = express.Router();

const {
    COGNITO_DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
} = process.env;

// Home Route
router.get("/", (req, res) => {
    res.send("WELCOME TO MY WEBSITE!");
});

// Redirect to Cognito login
router.get("/login", (req, res) => {
    const loginUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid&redirect_uri=${REDIRECT_URI}`;
    res.redirect(loginUrl);
});

// Handle Cognito callback (exchange code for tokens)
router.get("/callback", async (req, res) => {
    const authCode = req.query.code;
    if (!authCode) return res.status(400).send("Authorization code missing");

    try {
        const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;
        const tokenParams = qs.stringify({
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: authCode,
        });

        const tokenResponse = await axios.post(tokenUrl, tokenParams, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { id_token, access_token } = tokenResponse.data;

        // Store tokens in HTTP-only cookies
        res.cookie("id_token", id_token, { httpOnly: true, secure: false });
        res.cookie("access_token", access_token, { httpOnly: true, secure: false });

        res.redirect("/");
    } catch (error) {
        console.error("Token exchange failed:", error.response?.data || error.message);
        res.status(500).send("Error exchanging code for tokens");
    }
});

// Logout (clear cookies)
router.get("/logout", (req, res) => {
    res.clearCookie("id_token");
    res.clearCookie("access_token");

    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent("http://localhost:3000")}`;
    res.redirect(logoutUrl);
});



module.exports = router;
