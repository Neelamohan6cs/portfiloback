const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileImg: { type: String }, // URL or path of uploaded image
    roles: { type: [String], default: [] },
    socialLinks: {
      twitter: { type: String },
      facebook: { type: String },
      linkedin: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
    cvLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
