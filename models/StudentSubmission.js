const mongoose = require('mongoose');

const studentSubmissionSchema = new mongoose.Schema({
  submissionId: {
    type: String,
    unique: true
    // Auto-generated in pre-save hook
  },
  studentId: {
    type: String,
    default: null
  },
  studentName: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  concern: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Elementary', 'JHS', 'SHS', null],
    default: null
  },
  grade: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'For Consultation', 'Resolved', 'Converted to Referral'],
    default: 'Pending'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  notes: {
    type: String,
    default: null
  },
  nameOption: {
    type: String,
    enum: ['realName', 'anonymous', 'preferNot'],
    default: 'anonymous'
  },
  convertedToReferralId: {
    type: String,
    default: null // Will store referralId if converted
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Generate submissionId before saving (SUB-YYYYMMDD-###)
studentSubmissionSchema.pre('save', async function (next) {
  if (this.isNew && !this.submissionId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const count = await mongoose.model('StudentSubmission').countDocuments({
      submissionId: new RegExp(`^SUB-${dateStr}-`)
    });

    const sequence = String(count + 1).padStart(3, '0');
    this.submissionId = `SUB-${dateStr}-${sequence}`;
  }
  next();
});

module.exports = mongoose.model('StudentSubmission', studentSubmissionSchema);
