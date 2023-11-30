const users_model = require('../models/user.js');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

module.exports = {


    login: (req, res) => {
        res.render('pages/login.ejs');
    },

    registration: (req, res) => {
        res.render('pages/registration.ejs');
    },

    login_action: async (req, res) => {
        try {
            const { email, password } = req.body;
            const client = await users_model.findOne({ email });
            
            if (client) {
                const pass_is_correct = await bcrypt.compare(password, client.password);
                if (pass_is_correct) {
                    create_token(res, client)
                }
                else {
                    req.flash("error", "Вказаний пароль не вірний — повторіть спробу!");
                    res.redirect('back')
                }
            }
            else {
                req.flash("error", "Користувача з вказаною поштою не знайдено!");
                res.redirect('back')
            }
        } catch (error) {
            req.flash("error", error.message);
            res.redirect('back')
        }
    },

    registration_action: (req, res) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            
            users_model.create({
                'email': email,
                'password': password,
                'first_name': first_name,
                'last_name': last_name
            })
            .then((client) => {
                create_token(res, client);
            })
            .catch((error) => {
                req.flash("error", error.message);
                res.redirect('back')
            });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect('back')
        }
    },

    logout: (req, res) => {
        res.clearCookie('id');
        res.redirect('/login');
    },


    update_password: (req, res) =>{
        try{
        users_model.findById(req.user.id)
        .then(async (findedUser) => {
            if (findedUser) {

                const password = await bcrypt.hash(req.body.password, 10);
                users_model.findByIdAndUpdate(findedUser._id, { password: password })
                    .then(() => {

                        req.flash('success', 'Пароль успішно оновлено');
                        res.redirect('back');
                    })
                    .catch((error) => {
                        req.flash("error", error.message);
                        res.redirect('back')
                    })

            } else {
                req.flash("error", error.message);
                res.redirect('back')  }

        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    }
    catch(e){
        console.log(e)
    }
}


}

function create_token(res, client) {
    const token = jwt.sign(
        { id: client._id.toHexString() },
        process.env.SECRET,
        { expiresIn: "1h" }
    );
    client.token = token;
    res.cookie('id', token);
    switch (client.status) {
        case 0:
            res.redirect('/admin')
            break;
        case 1:
            res.redirect('/worker')
            break;
        case 2:
            res.redirect('/user')
            break;
        default:
            req.flash("error", "Помилка! Спробуйте ще раз.");
            res.redirect('back')
            break;
    }
}


