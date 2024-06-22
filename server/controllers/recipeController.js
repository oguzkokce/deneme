require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const Yoresel = await Recipe.find({ category: "Yoresel" }).limit(
      limitNumber
    );
    const Dunya = await Recipe.find({ category: "Dunya" }).limit(limitNumber);
    const Diger = await Recipe.find({ category: "Diger" }).limit(limitNumber);

    const food = { latest, Yoresel, Dunya, Diger };

    res.render("index", { title: "Lezizo - Anasayfa", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Lezizo - Kategoriler",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Lezizo - Kategoriler",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId).populate("comments");
    res.render("recipe", { title: "Lezizo - Yorumlar", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Lezizo", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded.");
      req.flash("infoErrors", "No Files were uploaded.");
      return res.redirect("/submit-recipe");
    }

    imageUploadFile = req.files.image;
    newImageName = Date.now() + imageUploadFile.name;
    uploadPath =
      require("path").resolve("./") + "/public/uploads/" + newImageName;

    imageUploadFile.mv(uploadPath, async function (err) {
      if (err) {
        console.error("File upload error:", err);
        req.flash("infoErrors", "File upload error.");
        if (!res.headersSent) {
          return res.status(500).send("Error uploading file.");
        }
      }

      try {
        const newRecipe = new Recipe({
          name: req.body.name,
          description: req.body.description,
          email: req.body.email,
          ingredients: req.body.ingredients,
          category: req.body.category,
          image: newImageName,
        });

        await newRecipe.save();

        req.flash("infoSubmit", "Recipe has been added.");
        if (!res.headersSent) {
          return res.redirect("/submit-recipe");
        }
      } catch (error) {
        console.error("Error saving recipe:", error);
        req.flash("infoErrors", error);
        if (!res.headersSent) {
          return res.redirect("/submit-recipe");
        }
      }
    });
  } catch (error) {
    console.error("Error in submitRecipeOnPost:", error);
    req.flash("infoErrors", error);
    if (!res.headersSent) {
      res.redirect("/submit-recipe");
    }
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { name, ingredients, description } = req.body;
    await Recipe.findByIdAndUpdate(recipeId, {
      name,
      ingredients,
      description,
    });
    req.flash("success_msg", "Tarif güncellendi.");
    res.redirect("/my-recipes");
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await Recipe.findByIdAndDelete(recipeId);
    req.flash("success_msg", "Tarif silindi.");
    res.redirect("/my-recipes");
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.rateRecipe = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const recipeId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      req.flash("error_msg", "Geçerli bir puan giriniz (1-5 arası).");
      return res.redirect(`/recipe/${recipeId}`);
    }

    const recipe = await Recipe.findById(recipeId);

    const existingRating = recipe.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({ userId, rating });
    }

    await recipe.save();

    req.flash("success_msg", "Tarife puan verdiniz.");
    res.redirect(`/recipe/${recipeId}`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.redirect("back");
  }
};

exports.getRecipeAverageRating = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const ratings = recipe.ratings;
    const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = ratings.length
      ? (total / ratings.length).toFixed(1)
      : 0;

    res.send({ averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu");
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ email: req.session.user.email }).lean();
    res.render("my-recipes", { title: "Tariflerim", recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu");
  }
};
