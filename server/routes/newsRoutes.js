const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { ensureAuthenticated } = require("../middlewares/auth");

// Haber ekleme
router.post("/add", ensureAuthenticated, newsController.addNews);

// Haber güncelleme
router.post("/update", ensureAuthenticated, newsController.updateNews);

// Haber silme
router.post("/delete", ensureAuthenticated, newsController.deleteNews);

// Haber listeleme
router.get("/", newsController.getNews);

// Haber detaylarını görüntüleme
router.get("/:id", newsController.getNewsById);

module.exports = router;
