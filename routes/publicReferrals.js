const express = require("express");
const router = express.Router();
const StudentSubmission = require("../models/StudentSubmission");

// PUBLIC ROUTE - Student Form Submission (No Auth Required)
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received student concern:", req.body);

    const { studentName, concern, nameOption } = req.body;

    // Validate input
    if (!concern || concern.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Concern is required' 
      });
    }

    // Create new student submission
    const newSubmission = new StudentSubmission({
      studentName: studentName || 'Anonymous',
      concern: concern.trim(),
      nameOption: nameOption || 'preferNot',
      status: 'Pending',
      severity: 'Low' // Default - counselor can update after review
    });

    const savedSubmission = await newSubmission.save();
    
    console.log("✅ Student concern submitted:", savedSubmission.submissionId);
    
    res.status(201).json({
      success: true,
      message: 'Concern submitted successfully',
      data: {
        submissionId: savedSubmission.submissionId
      }
    });

  } catch (error) {
    console.error("❌ Error submitting student concern:", error);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
      details: error.message
    });
  }
});

module.exports = router;
