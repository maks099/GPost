const jwt = require("jsonwebtoken");
const config = process.env;

const admin_verify = async(req, res, next) => {
  const token = req.cookies["id"];
  if (!token) {
    req.flash("error", "Будь ласка, авторизуйтесь!");
    res.render('pages/login')
  }
  try {
    req.user = jwt.verify(token, config.SECRET);
    next()
  } catch (error) {
    req.flash("error", error.message);
    res.render('pages/landing')
  }
};

module.exports = admin_verify;