const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "assistant"], // valid roles for DB
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);