import express from 'express';
import ExamEnquiry from '../models/ExamEnquiry.js';

const router = express.Router();

// POST route to create new exam enquiry
router.post('/examenquiry', async (req, res) => {
  try {
    const {
      name,
      number,
      inquiry,
      category,
      examName,
      courseName,
      agreeToContact
    } = req.body;

    // Basic validation
    if (!name || !number || !inquiry || !examName || !courseName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, phone, inquiry, examName, courseName'
      });
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Agreement validation
    if (!agreeToContact) {
      return res.status(400).json({
        success: false,
        message: 'Please agree to be contacted regarding your inquiry'
      });
    }

    // Check for duplicate enquiries (same phone and exam within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingEnquiry = await ExamEnquiry.findOne({
      phone: number,
      examName: examName,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingEnquiry) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an enquiry for this exam recently. Please wait 24 hours before submitting another enquiry.'
      });
    }

    // Create new exam enquiry
    const newExamEnquiry = new ExamEnquiry({
      name: name.trim(),
      phone: number,
      inquiry: inquiry.trim(),
      category: category || 'Competitive Exams',
      examName: examName.trim(),
      courseName: courseName.trim(),
      agreeToContact
    });

    // Save to database
    await newExamEnquiry.save();

    // Success response
    res.status(201).json({
      success: true,
      message: 'Exam enquiry submitted successfully! We will contact you soon.',
      data: {
        id: newExamEnquiry._id,
        name: newExamEnquiry.name,
        examName: newExamEnquiry.examName,
        courseName: newExamEnquiry.courseName,
        submittedAt: newExamEnquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting exam enquiry:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate enquiry found'
      });
    }

    // General server error
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to fetch all exam enquiries (for admin panel)
router.get('/examenquiries', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { examName: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch enquiries with pagination
    const enquiries = await ExamEnquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await ExamEnquiry.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEnquiries: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching exam enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to fetch single exam enquiry by ID
router.get('/examenquiry/:id', async (req, res) => {
  try {
    const enquiry = await ExamEnquiry.findById(req.params.id).select('-__v');
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    console.error('Error fetching exam enquiry:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH route to update exam enquiry status (for admin)
router.patch('/examenquiry/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'resolved', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required: pending, contacted, resolved, cancelled'
      });
    }

    const updatedEnquiry = await ExamEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedEnquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: updatedEnquiry
    });

  } catch (error) {
    console.error('Error updating exam enquiry status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to get enquiry statistics (for admin dashboard)
router.get('/examenquiries/stats', async (req, res) => {
  try {
    const totalEnquiries = await ExamEnquiry.countDocuments();
    const pendingEnquiries = await ExamEnquiry.countDocuments({ status: 'pending' });
    const contactedEnquiries = await ExamEnquiry.countDocuments({ status: 'contacted' });
    const resolvedEnquiries = await ExamEnquiry.countDocuments({ status: 'resolved' });
    
    // Get enquiries by exam (top 10)
    const enquiriesByExam = await ExamEnquiry.aggregate([
      {
        $group: {
          _id: '$examName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent enquiries count (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEnquiries = await ExamEnquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalEnquiries,
        pending: pendingEnquiries,
        contacted: contactedEnquiries,
        resolved: resolvedEnquiries,
        recent: recentEnquiries,
        byExam: enquiriesByExam
      }
    });

  } catch (error) {
    console.error('Error fetching enquiry statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;