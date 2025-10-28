const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    nameofeducation: { type: String, required: true },
    nameofinstitution: { type: String, required: true },
    startyear: { type: String, required: true },
    endyear: { type: String, required: true },
    percentage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
