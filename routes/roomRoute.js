const express = require('express');
const router = express.Router();
const multer = require('multer');
const RoomDetails = require('../models/roomDetails');
const fs = require("fs");
const path = require("path");
const { uploadToS3 } = require('../uploadToS3'); // Adjust path as needed
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");



// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// GET endpoint to fetch all room details
router.get('/', async (req, res) => {
  try {
    const rooms = await RoomDetails.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Failed to fetch room details' });
  }
});
router.get('/x', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'available.html')); // Adjust path if needed
});

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, `${suffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { files: 4 }, // Maximum of 4 files
});

// POST endpoint to create a new room listing with up to 4 photos
router.post('/create', upload.array('photos', 4), async (req, res) => {
  try {
    const {
      location_cordinate,
      available_from,
      preferences,
      rent,
      city,
      state,
      pincode,
      deposit,
      buildup_area,
      furnishing,
      bhk,
      parking,
      balcony,
      age_of_property,
      non_veg_allowed,
      floor_number,
      facing,
      number_of_bathrooms,
      water_supply,
      inverter_backup,
      description,
      property_type,
      landlord_id,
      address,
      landmark
    } = req.body;

    const files = req.files; // Array of uploaded files

    if (!files || files.length < 1 || files.length > 4) {
      return res.status(400).json({ error: "Please upload between 1 and 4 photos." });
    }

    // Upload each photo to S3 and collect their URLs
    const publicUrls = [];

    for (const file of files) {
      const imagePath = file.path;

      try {
        const publicUrl = await uploadToS3(imagePath);
        publicUrls.push(publicUrl);
        // Optionally delete the local file after successful upload
        fs.unlinkSync(imagePath);
      } catch (uploadError) {
        console.error("Error uploading file to S3:", uploadError);
        return res.status(500).json({ error: "Failed to upload photos to S3." });
      }
    }

    // Create a new room record in the database
    const newRoom = await RoomDetails.create({
      photos: JSON.stringify(publicUrls), // Store URLs as a JSON string
      location_cordinate,
      available_from,
      preferences,
      rent,
      city,
      state,
      pincode,
      deposit,
      buildup_area,
      furnishing,
      bhk,
      parking,
      balcony,
      age_of_property,
      non_veg_allowed,
      floor_number,
      facing,
      number_of_bathrooms,
      water_supply,
      inverter_backup,
      description,
      property_type,
      landlord_id,
      address,
      landmark,
    });

    // Respond with the saved room details
    res.status(200).json(newRoom);
  } catch (error) {
    console.error("Error creating room details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/postyourroom',authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index2.html')); // Adjust path if needed
});

module.exports = router;
