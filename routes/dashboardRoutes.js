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



router.get('/myrooms', authMiddleware, async (req, res) => {
    try {
      const landlordId = req.user.id; // assuming this works
      const rooms = await RoomDetails.findAll({
        where: { landlord_id: landlordId }
      });
  
      res.json(rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  });
  
  router.get('/',authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'landlord-dashboard.html')); // Adjust path if needed
  });


// DELETE endpoint to delete a room by room_id (only if it belongs to the logged-in user)
router.delete('/delete/:room_id', authMiddleware, async (req, res) => {
  try {
    const roomId = req.params.room_id;
    const landlordId = req.user.id; // from JWT via authMiddleware

    const room = await RoomDetails.findOne({ where: { room_id: roomId, landlord_id: landlordId } });

    if (!room) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    await room.destroy(); // Delete the room
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

router.get('/xxx',authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index2.html')); // Adjust path if needed
});

  module.exports = router;
