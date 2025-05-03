const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('../models');
const Landlord = db.Landlord;

const client = jwksClient({
  jwksUri: `https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_89pEaReWF/.well-known/jwks.json`
});

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

const optionalAuth = async (req, res, next) => {
  const idToken = req.cookies.id_token;
  const accessToken = req.cookies.access_token;

  if (!idToken && !accessToken) {
    // No token found, proceed without attaching user
    return next();
  }

  const decodeAndAttach = async (token, tokenType) => {
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const landlord_id = decoded.sub;
      const email = decoded.email || decoded.username;

      if (Landlord) {
        const landlord = await Landlord.findOne({ where: { landlord_id } });

        if (!landlord) {
          await Landlord.create({ landlord_id, email });
        }

        req.user = { id: landlord_id, email };
      }
    } catch (error) {
      console.error(`${tokenType} verification failed:`, error.message);
    }
  };

  if (idToken) await decodeAndAttach(idToken, "ID Token");
  if (accessToken) await decodeAndAttach(accessToken, "Access Token");

  next();
};

module.exports = optionalAuth;
