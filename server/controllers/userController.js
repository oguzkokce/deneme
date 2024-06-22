const User = require("../models/user");
const Recipe = require("../models/Recipe");

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password }, (err, user) => {
    if (err || !user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/users/login");
    }
    req.session.user = user;
    res.redirect("/");
  });
};

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });
  newUser.save((err) => {
    if (err) {
      req.flash("error", "Failed to register");
      return res.redirect("/users/register");
    }
    req.session.user = newUser;
    res.redirect("/");
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
      .populate("favorites")
      .lean();
    const recipes = await Recipe.find({ email: user.email }).lean();
    user.recipes = recipes;
    res.render("profile", { title: "Profile", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("ÖNCE GİRİŞ YAPMALISINIZ");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { name, email } = req.body;
    await User.findByIdAndUpdate(userId, { name, email });
    req.session.user.name = name;
    req.session.user.email = email;
    req.flash("success_msg", "Profile updated successfully");
    res.redirect("/users/profile");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.session.user._id;
    await Recipe.deleteMany({ email: req.session.user.email });
    await User.findByIdAndDelete(userId);
    req.session.destroy();
    res.redirect("/users/register");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const recipeId = req.params.id;

    // Kullanıcıyı bul ve favorilere ekle
    const user = await User.findById(userId);
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
      req.flash("success_msg", "Tarif favorilere eklendi.");
    } else {
      req.flash("info_msg", "Bu tarif zaten favorilerinizde.");
    }

    res.redirect("back");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.redirect("back");
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Kullanıcının favori tariflerini bulun
    const user = await User.findById(userId).populate("favorites");

    res.render("favs", { title: "Favori Tarifler", recipes: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu");
  }
};
