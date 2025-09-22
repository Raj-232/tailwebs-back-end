const Assignment = require('../models/Assignment');

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      teacher: req.user._id
    });

    await assignment.save();
    await assignment.populate('teacher', 'name email');

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all assignments for teacher
const getTeacherAssignments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { teacher: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .populate('teacher', 'name email')
      .populate('submissions.student', 'name email')
      .sort({ createdAt: -1 });

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get published assignments for students
const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ status: 'published' })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single assignment
const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('submissions.student', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is the teacher who created the assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prevent editing published assignments (except status changes)
    if (assignment.status === 'published' && status !== 'completed') {
      return res.status(400).json({ message: 'Cannot edit published assignment' });
    }

    // Prevent editing completed assignments
    if (assignment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot edit completed assignment' });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.status = status || assignment.status;

    await assignment.save();
    await assignment.populate('teacher', 'name email');
    await assignment.populate('submissions.student', 'name email');

    res.json({
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is the teacher who created the assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow deletion of draft assignments
    if (assignment.status !== 'draft') {
      return res.status(400).json({ message: 'Can only delete draft assignments' });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit assignment answer
const submitAssignment = async (req, res) => {
  try {
    const { answer } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.status !== 'published') {
      return res.status(400).json({ message: 'Assignment is not available for submission' });
    }

    // Check if assignment is past due date
    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({ message: 'Assignment submission deadline has passed' });
    }

    // Check if student has already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    assignment.submissions.push({
      student: req.user._id,
      answer
    });

    await assignment.save();
    await assignment.populate('submissions.student', 'name email');

    res.json({
      message: 'Assignment submitted successfully',
      assignment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's submission for an assignment
const getStudentSubmission = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student._id.toString() === req.user._id.toString()
    );

    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }

    res.json({ submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAssignment,
  getTeacherAssignments,
  getStudentAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getStudentSubmission
};