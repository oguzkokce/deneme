const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { ensureAuthenticated } = require("../middlewares/auth");

// Yorum ekleme
router.post("/add", ensureAuthenticated, commentController.addComment);

// Yorum güncelleme
router.post("/update", ensureAuthenticated, commentController.updateComment);

// Yorum silme
router.post("/delete", ensureAuthenticated, commentController.deleteComment);

module.exports = router;
