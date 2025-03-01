const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true }
});

const PatientSchema = new Schema({
  medical_history: { type: String },
  allergies: { type: String },
  medications: [{ type: String }],
  emergency_contact: EmergencyContactSchema
});

const ProviderSchema = new Schema({
  specialization: { type: String, required: true },
  hospital_affiliation: { type: String },
  license_number: { type: String, required: true },
  years_of_experience: { type: Number, required: true },
  availability: {
    days_of_week: [{ type: String }],
    working_hours: {
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  }
});

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true }
});

const UserSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'provider'], required: true },
  date_of_birth: { type: String },
  address: AddressSchema,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' },
  role_specific_data: {
    patient: { type: PatientSchema },
    provider: { type: ProviderSchema }
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
