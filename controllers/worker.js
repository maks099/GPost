const users_model = require('../models/user.js');
const sendings_model = require('../models/sending.js');
require("dotenv").config();
const departments_model = require('../models/department.js');

module.exports = {

    main: (req, res) => {
        users_model
        .findById(req.user.id)
        .then((worker) => {
            departments_model.findById(worker.department)
            .then(async(department) => {
                const sending_arr = await sendings_model.find({'status': { $ne: 3 }, 'department': department._id})
                .populate({path: 'department'})
                .sort({ date: -1, status: 1 })
                res.render('pages/worker', { 
                    department: department,
                    sending_arr: sending_arr, 
                })
            })
            .catch((error) => {
                req.flash("error", error.message);
                res.redirect('back')
            })
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
       
    },

    add: (req, res) => {
        try {
            const { email, password, first_name, last_name, dep_id } = req.body;
            
            users_model.create({
                'email': email,
                'password': password,
                'first_name': first_name,
                'last_name': last_name,
                'status': 1,
                'department': dep_id
            })
            .then(_ => {
                res.redirect('back')
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

    edit: (req, res) => {
        const {id, department} = req.body;
        console.log(id, department)

        users_model.findByIdAndUpdate(id, {department: department})
        .then(() => res.redirect('back'))
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    },

    delete: (req, res) => {
        const {id} = req.body;
        users_model.findByIdAndDelete(id)
        .then(_ => res.send(200))
        .catch((error) => {
            req.flash('error', error.message)
            res.send(500)
        })
    }

}
