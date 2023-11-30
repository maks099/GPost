const departments_model = require('../models/department.js');
const sendings_model = require('../models/sending.js');

module.exports = {


    main: (req, res) => {
        const {id} = req.query;
        departments_model.findById(id)
        .then(async(department) => {
            const sending_arr = await sendings_model.find({'status': { $ne: 3 }, 'department': id})
            .populate({path: 'department'})
            .sort({ date: -1, status: 1 })
            res.render('pages/department', { 
                department: department,
                sending_arr: sending_arr, 
            })
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    },

    add: (req, res) => {
        const { max_weight, address, name, lat, lon } = req.body;
        new departments_model(
            {
                'address': address,
                'max_weight': max_weight,
                "name": name,
                'lat': lat,
                'lon': lon,
            }
        )
        .save()
        .then(async () => {
            res.redirect('back')
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    },

    edit: (req, res) => {
        const { max_weight, address, name, lat, lon, id } = req.body;
        departments_model.findByIdAndUpdate(id,
            {
                'address': address,
                'max_weight': max_weight,
                "name": name,
                'lat': lat,
                'lon': lon,
            }
        )
        .then(async () => {
            res.redirect('back')
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    },

    delete: (req, res) => {
        const {id} = req.body;
        departments_model.findByIdAndDelete(id)
        .then(_ => res.send(200))
        .catch((error) => {
            req.flash('error', error.message)
            res.send(500)
        })
    }

}