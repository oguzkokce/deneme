const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");

// Login ve register sayfaları için GET istekleri
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

// Login ve register işlemleri için POST istekleri
router.post("/login", userController.login);
router.post("/register", userController.register);

// Profil sayfası ve işlemleri için istekler
router.get("/profile", ensureAuthenticated, userController.getProfile);
router.post(
  "/profile/update",
  ensureAuthenticated,
  userController.updateProfile
);
router.post(
  "/profile/delete",
  ensureAuthenticated,
  userController.deleteAccount
);

// Logout işlemi
router.get("/logout", userController.logout);

// Favorilere ekleme ve listeleme
router.post("/favorite/:id", ensureAuthenticated, userController.addFavorite);
router.get("/favs", ensureAuthenticated, userController.getFavorites);

module.exports = router;
