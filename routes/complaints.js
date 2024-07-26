const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const Complaint = require("../models/complaint");

// Endpoint to create a new complaint
router.post("/", authenticateToken, async (req, res) => {
  const { title, description, studentNIM, phoneNumber } = req.body;

  try {
    // Create a new complaint in the database
    const complaint = await Complaint.create({
      title,
      description,
      studentNIM,
      phoneNumber,
      userId: req.user.id, // Associate the complaint with the authenticated user
    });
    // Respond with the created complaint
    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (err) {
    // Handle errors and respond with a 400 status code
    res.status(400).json({
      message: "Error creating complaint",
      error: err.message,
    });
  }
});

// Endpoint to get all complaints of the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Find all complaints associated with the authenticated user
    const complaints = await Complaint.findAll({
      where: { userId: req.user.id },
    });
    // Respond with the retrieved complaints
    res.status(200).json({
      message: "Complaints retrieved successfully",
      complaints,
    });
  } catch (err) {
    // Handle errors and respond with a 400 status code
    res.status(400).json({
      message: "Error retrieving complaints",
      error: err.message,
    });
  }
});

// Endpoint to get a specific complaint by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    // Find the complaint by ID and userId
    const complaint = await Complaint.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }
    // Respond with the retrieved complaint
    res.status(200).json({
      message: "Complaint retrieved successfully",
      complaint,
    });
  } catch (err) {
    // Handle errors and respond with a 400 status code
    res.status(400).json({
      message: "Error retrieving complaint",
      error: err.message,
    });
  }
});

// Endpoint to add a response and update the status of a complaint
router.put(
  "/respond/:id",
  authenticateToken, // Middleware to authenticate the token
  authorizeRole(["staff"]), // Middleware to authorize only users with the "staff" role
  async (req, res) => {
    const complaintId = req.params.id;
    const { response, status } = req.body;

    try {
      // Find the complaint by its primary key (id)
      const complaint = await Complaint.findByPk(complaintId);
      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      // Update the complaint with the response and status
      complaint.response = response;
      complaint.status = status;
      complaint.respondedAt = new Date();
      await complaint.save();

      // Respond with the updated complaint
      res.status(200).json({
        message: "Response and status updated successfully",
        complaint,
      });
    } catch (err) {
      console.error("Error updating response and status:", err);
      // Handle errors and respond with a 500 status code
      res.status(500).json({
        message: "Error updating response and status",
        error: err.message,
      });
    }
  }
);

module.exports = router; // Export the router
