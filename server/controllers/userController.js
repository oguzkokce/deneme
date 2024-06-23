const User = require("../models/user");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcrypt"); // bcrypt modülünü içe aktarın

exports.register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Kullanıcı olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "User already exists");
      return res.redirect("/users/register");
    }

    // Şifreyi hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/users/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error_msg", "An error occurred during registration");
    res.redirect("/users/register");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/users/login");
    }

    // Şifre doğrulama
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error_msg", "Incorrect password");
      return res.redirect("/users/login");
    }

    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error_msg", "An error occurred during login");
    res.redirect("/users/login");
  }
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
    const user = await User.findById(userId).populate("favorites");

    res.render("favs", { title: "Favori Tarifler", recipes: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/users/login");
};
