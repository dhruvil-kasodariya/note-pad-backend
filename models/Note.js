const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    noteTitle: {
      type: String,
      required: true,
    },
    noteContent: {
      type: String,
      required: true,
    },
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      useremail: {
        type: String,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", noteSchema);
