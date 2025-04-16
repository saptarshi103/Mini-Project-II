const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

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
const authenticateToken = (req, res, next) => {
  const token = req.cookies.id_token || req.cookies.access_token; // Extract token from cookies
  console.log("Request Headers:", req.headers);

  console.log("Extracted Token:", token);
  console.log("Cookies:", req.cookies);


  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.redirect('/login');
    }

    req.user = decoded;  // Attach user info
    next();
  });
};

module.exports = authenticateToken;
