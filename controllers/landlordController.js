const Landlord = require('../models/landlord');

const updateLandlordProfile = async (req, res) => {
    const { name, mobile } = req.body;
    const landlordId = req.user.landlord_id || req.user.id;

    if (!name || !mobile) {
        return res.status(400).json({ message: 'Name and mobile are required.' });
    }

    try {
        await Landlord.update(
            { name, mobile, profile_completed: true },
            { where: { landlord_id: landlordId } }
        );
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};


// In landlordController.js
const getLandlordProfile = async (req, res) => {
    const landlordId = req.user.landlord_id || req.user.id;
    try {
      const landlord = await Landlord.findByPk(landlordId);
      if (!landlord) return res.status(404).json({ message: 'Not found' });
      res.json(landlord);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  };

  module.exports = {
    updateLandlordProfile,
    getLandlordProfile
};

