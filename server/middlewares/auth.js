module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.session.user) {
      return next();
    } else {
      req.flash("error_msg", "Please log in to view that resource");
      res.redirect("/users/login");
    }
  },
};
