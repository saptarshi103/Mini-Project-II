const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('../models');
const Landlord = db.Landlord;

const client = jwksClient({
  jwksUri: `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_89pEaReWF/.well-known/jwks.json`
});

// Get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

// Middleware
const authenticateToken = async (req, res, next) => {
  const idToken = req.cookies.id_token;
  const accessToken = req.cookies.access_token;

  if (!idToken && !accessToken) {
    return res.redirect('/login');
  }

  // Decode and verify token
  const decodeAndStoreToken = async (token, tokenType) => {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const landlord_id = decoded.sub;
      const email = decoded.email || decoded.username;

      if (!Landlord) {
        console.error("Landlord model not loaded.");
        return;
      }

      const landlord = await Landlord.findOne({ where: { landlord_id } });

      if (!landlord) {
        await Landlord.create({ landlord_id, email });
        console.log("✅ New Landlord Created:", { landlord_id, email });
      } else {
        console.log("✅ Landlord Already Exists:", landlord.toJSON());
      }

      req.user = { id: landlord_id, email: email };
    } catch (error) {
      console.error(`${tokenType} verification failed:`, error.message);
      throw new Error(`${tokenType} Invalid or Expired`);
    }
  };

  try {
    if (idToken) await decodeAndStoreToken(idToken, "ID Token");
    if (accessToken) await decodeAndStoreToken(accessToken, "Access Token");

    next(); // only go to next if token is valid
  } catch (err) {
    console.error('Authentication Error:', err.message);
    return res.redirect('/login'); // redirect if token invalid or expired
  }
};

module.exports = authenticateToken;
