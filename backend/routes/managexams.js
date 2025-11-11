import express from 'express';
import Manage from '../models/Manageexams.js';
import Exam from '../models/Exam.js';
const router = express.Router();

// Get all managed courses with their exams
router.get('/', async (req, res) => {
  try {
    const managedCourses = await Manage.find().populate('exams');
    res.json(managedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new course with exams
router.post('/', async (req, res) => {
  try {
    const { name, examIds } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Course name is required' });
    }

    // Check if course name already exists
    const existingCourse = await Manage.findOne({ name: name.trim() });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course name already exists' });
    }

    // Verify all exam IDs exist
    if (examIds && examIds.length > 0) {
      const exams = await Exam.find({ _id: { $in: examIds } });
      if (exams.length !== examIds.length) {
        return res.status(400).json({ error: 'One or more exam IDs are invalid' });
      }
    }

    const newCourse = new Manage({
      name: name.trim(),
      exams: examIds || []
    });

    await newCourse.save();
    const populatedCourse = await Manage.findById(newCourse._id).populate('exams');
    res.status(201).json(populatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add exam to course
router.put('/:courseId/exams', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { examId } = req.body;

    const course = await Manage.findById(courseId);
    const exam = await Exam.findById(examId);

    if (!course || !exam) {
      return res.status(404).json({ error: 'Course or Exam not found' });
    }

    // Check if exam already exists in course
    if (course.exams.includes(examId)) {
      return res.status(400).json({ error: 'Exam already exists in this course' });
    }

    course.exams.push(examId);
    await course.save();

    const updatedCourse = await Manage.findById(courseId).populate('exams');
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove exam from course
router.delete('/:courseId/exams/:examId', async (req, res) => {
  try {
    const { courseId, examId } = req.params;

    const course = await Manage.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.exams = course.exams.filter(id => id.toString() !== examId);
    await course.save();

    const updatedCourse = await Manage.findById(courseId).populate('exams');
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course name
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const updatedCourse = await Manage.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).populate('exams');

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await Manage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;