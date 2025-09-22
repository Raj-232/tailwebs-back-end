const express = require('express');
const {
  createAssignment,
  getTeacherAssignments,
  getStudentAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getStudentSubmission
} = require('../controllers/assignmentController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Teacher routes
router.post('/', requireRole(['teacher']), createAssignment);
router.get('/teacher', requireRole(['teacher']), getTeacherAssignments);
router.put('/:id', requireRole(['teacher']), updateAssignment);
router.delete('/:id', requireRole(['teacher']), deleteAssignment);

// Student routes
router.get('/student', requireRole(['student']), getStudentAssignments);
router.post('/:id/submit', requireRole(['student']), submitAssignment);
router.get('/:id/submission', requireRole(['student']), getStudentSubmission);

// Common routes
router.get('/:id', getAssignment);

module.exports = router;