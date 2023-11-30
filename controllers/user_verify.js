const jwt = require("jsonwebtoken");
const users_model = require("../models/user.js");
const config = process.env;

const admin_verify = async(req, res, next) => {
  const token = req.cookies["id"];
  if (!token) {
    req.flash("error", "Будь ласка, авторизуйтесь!");
    res.render('pages/login')
  }
  try {
    req.user = jwt.verify(token, config.SECRET);
    const client = await users_model.findById(req.user.id);
    if(client.status != 2){
      req.flash("error", 'У Вас немає прав доступу до цієї частини програми!');
      res.render('pages/landing')
    } else {
      return next();
    }

  } catch (error) {
    req.flash("error", error.message);
    res.render('pages/landing')
  }
};

module.exports = admin_verify;