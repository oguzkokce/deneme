const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/", recipeController.homepage);
router.get("/recipe/:id", recipeController.exploreRecipe);
router.get("/categories", recipeController.exploreCategories);
router.get("/categories/:id", recipeController.exploreCategoriesById);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/explore-random", recipeController.exploreRandom);

router.get("/submit-recipe", ensureAuthenticated, (req, res) => {
  res.render("submit-recipe", {
    title: "Submit Recipe",
    infoSubmitObj: req.flash("infoSubmitObj"),
    infoErrorsObj: req.flash("infoErrorsObj"),
  });
});

router.post(
  "/submit-recipe",
  ensureAuthenticated,
  recipeController.submitRecipeOnPost
);

// PUT request for updating a recipe
router.put(
  "/update/:id",
  ensureAuthenticated,
  (req, res, next) => {
    console.log("PUT /update/:id", req.params.id);
    next();
  },
  recipeController.updateRecipe
);

// DELETE request for deleting a recipe
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  (req, res, next) => {
    console.log("DELETE /delete/:id", req.params.id);
    next();
  },
  recipeController.deleteRecipe
);

module.exports = router;
