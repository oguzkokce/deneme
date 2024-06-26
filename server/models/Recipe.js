const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },
  description: {
    type: String,
    required: "This field is required.",
  },
  ingredients: {
    type: Array,
    required: "This field is required.",
  },
  category: {
    type: String,
    enum: ["Yoresel", "Dunya", "Diger"],
    required: "This field is required.",
  },
  image: {
    type: String,
    required: "This field is required.",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
    },
  ],
});

module.exports =
  mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
