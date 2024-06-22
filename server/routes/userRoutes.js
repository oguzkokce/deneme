const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/profile", ensureAuthenticated, userController.getProfile);
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/logout", userController.logout);
router.get("/profile", userController.getProfile);
router.post("/profile/update", userController.updateProfile);
router.post("/profile/delete", userController.deleteAccount);
router.post("/favorite/:id", ensureAuthenticated, userController.addFavorite);

// Favorilere ekleme
router.post("/favorite/:id", ensureAuthenticated, userController.addFavorite);

// Favori tarifleri listeleme
router.get("/favs", ensureAuthenticated, userController.getFavorites);

module.exports = router;
