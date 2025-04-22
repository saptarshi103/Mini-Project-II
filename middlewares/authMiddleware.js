const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('../models');
const Landlord = db.Landlord; // Correct way to access model

console.log("Landlord Model Loaded?", !!Landlord); // Should print 'true'
;

const client = jwksClient({
  jwksUri: `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_89pEaReWF/.well-known/jwks.json`
});

// Function to get signing key
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

// Middleware function
const authenticateToken = async (req, res, next) => {
  const idToken = req.cookies.id_token;
  const accessToken = req.cookies.access_token;

  console.log("Extracted ID Token:", idToken);
  console.log("Extracted Access Token:", accessToken);

  if (!idToken && !accessToken) {
    return res.redirect('/login');
  }

  // Function to decode token and store details in DB
  const decodeAndStoreToken = async (token, tokenType) => {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      console.log(`Decoded ${tokenType}:`, decoded);

      // Extract sub and email
      const landlord_id = decoded.sub;
      const email = decoded.email || decoded.username; // Use username if email is missing

      console.log(`Extracted from ${tokenType} -> Landlord ID: ${landlord_id}, Email: ${email}`);

      if (!Landlord) {
        console.error("Landlord model is not properly loaded. Check Sequelize setup.");
        return;
      }

      // Ensure Sequelize table is connected
      const landlord = await Landlord.findOne({ where: { landlord_id } });

      if (!landlord) {
        await Landlord.create({ landlord_id, email });
        console.log("✅ New Landlord Created:", { landlord_id, email });
      } else {
        console.log("✅ Landlord Already Exists:", landlord.toJSON());
      }

      req.user = { id: landlord_id, email: email }; // Attach user info
    } catch (error) {
      console.error(`${tokenType} verification failed:`, error.message);
    }
  };

  // Decode and store details from both tokens
  if (idToken) await decodeAndStoreToken(idToken, "ID Token");
  if (accessToken) await decodeAndStoreToken(accessToken, "Access Token");

  next();
};

module.exports = authenticateToken;
