const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Schema = mongoose.Schema;

const healthInfoSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

healthInfoSchema.index({ title: 1 }); // Index for faster queries

// Soft delete: exclude deleted records from find queries
healthInfoSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

const HealthInfo = mongoose.model('HealthInfo', healthInfoSchema);
module.exports = HealthInfo;
