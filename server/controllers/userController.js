const User = require("../models/User");
const Recipe = require("../models/Recipe");

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password }, (err, user) => {
    if (err || !user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/users/login");
    }
    req.session.user = user;
    res.redirect("/users/profile");
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
    res.redirect("/users/profile");
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).lean();
    const recipes = await Recipe.find({ email: user.email }).lean();
    user.recipes = recipes;
    res.render("profile", { title: "Profile", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
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
