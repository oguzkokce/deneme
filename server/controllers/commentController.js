const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");

exports.addComment = async (req, res) => {
  try {
    const { recipeId, content } = req.body;
    const userId = req.session.user._id;
    const newComment = new Comment({ recipeId, userId, content });
    await newComment.save();

    await Recipe.findByIdAndUpdate(recipeId, {
      $push: { comments: newComment._id },
    });

    req.flash("success_msg", "Yorum eklendi.");
    res.redirect(`/recipe/${recipeId}`);
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    await Comment.findByIdAndUpdate(commentId, { content });
    req.flash("success_msg", "Yorum güncellendi.");
    res.redirect(`/recipe/${req.body.recipeId}`);
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId, recipeId } = req.body;
    await Comment.findByIdAndDelete(commentId);

    await Recipe.findByIdAndUpdate(recipeId, {
      $pull: { comments: commentId },
    });

    req.flash("success_msg", "Yorum silindi.");
    res.redirect(`/recipe/${recipeId}`);
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};
