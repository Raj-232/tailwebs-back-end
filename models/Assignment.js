const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
assignmentSchema.index({ teacher: 1, status: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);