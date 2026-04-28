const mongoose = require("mongoose");

const hairSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    originalImageUrl: {
      type: String,
      required: true,
    },
    originalImageFileId: {
      type: String,
      required: true,
    },
    generatedImageUrl: {
      type: String,
      required: true,
    },
    generatedThumbnailUrl: {
      type: String,
      default: "",
    },
    generatedImageFileId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Hair", hairSchema);
