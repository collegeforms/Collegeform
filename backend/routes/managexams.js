import express from 'express';
import Manage from '../models/Manageexams.js';
import Exam from '../models/Exam.js';

const router = express.Router();

// Get all courses with their exams
router.get('/', async (req, res) => {
  try {
    const courses = await Manage.find().populate('exams');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new course
router.post('/', async (req, res) => {
  try {
    const newCourse = new Manage(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
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
      return res.status(404).json({ error: 'Manage or Exam not found' });
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
      return res.status(404).json({ error: 'Manage not found' });
    }

    course.exams = course.exams.filter(id => id.toString() !== examId);
    await course.save();

    const updatedCourse = await Manage.findById(courseId).populate('exams');
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await Manage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Manage deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;