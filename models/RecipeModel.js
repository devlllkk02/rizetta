const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { ObjectId } = mongoose.Schema.Types;

const CurrentDate = moment.tz(Date.now(), "Asia/Colombo");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    hearts: [{ type: ObjectId, ref: "User" }],
    bookmark: [{ type: ObjectId, ref: "User" }],
    ratings: [
      {
        score: { type: Number, default: 0 },
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    comments: [
      {
        text: { type: String },
        postedBy: { type: ObjectId, ref: "User" },
        date: { type: String, default: CurrentDate.toLocaleString() },
        createdAt: { type: Date, default: new Date() },
      },
    ],
    postedBy: { type: ObjectId, ref: "User" },
    date: { type: String, default: CurrentDate.toLocaleString() },
  },
  { timestamps: true }
);

mongoose.model("Recipe", recipeSchema);
