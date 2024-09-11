
module.exports = function () {
  return function secured(req, res, next) {
    if (req.session.user) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
};
