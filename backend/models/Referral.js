const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralId: { type: String, required: true, unique: true }, // e.g. REF-9824-MH
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  referringDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  destinationHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  destinationDepartment: { type: String, required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String },
  urgency: { type: String, enum: ['Routine', 'Urgent', 'Emergency'], default: 'Routine' },
  status: { type: String, enum: ['Referred', 'Received', 'Seen', 'Closed', 'Pending'], default: 'Referred' },
  history: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
