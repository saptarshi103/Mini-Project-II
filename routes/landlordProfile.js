const express = require('express');
const router = express.Router();
const { updateLandlordProfile } = require('../controllers/landlordController');
const { getLandlordProfile } = require('../controllers/landlordController');



const authMiddleware = require('../middlewares/authMiddleware'); // Assuming this sets req.user
const path = require('path');


router.post('/complete-profile', authMiddleware, updateLandlordProfile);
router.get('/complete-profile1', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'complete-profile.html'));
  });
  
// In routes/landlordProfile.js
router.get('/p', authMiddleware, getLandlordProfile);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'profile.html'));
});

module.exports = router;
