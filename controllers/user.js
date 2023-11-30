const users_model = require('../models/user.js');
const sendings_model = require('../models/sending.js');
require("dotenv").config();

const departments_model = require('../models/department.js');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports = {

    main: (req, res) => {
        users_model
            .findById(req.user.id)
            .then(async(client) => {
                const department_arr = await departments_model.find({});
                const sending_arr = await sendings_model.find({'client': req.user.id})
                .populate({path: 'department'})
                .sort({ date: -1, status: -1 })
                res.render('pages/user', { 
                    clientObj: client, 
                    sending_arr: sending_arr,
                    department_arr: department_arr
                })
            })
            .catch((error) => {
                req.flash("error", error.message);
                res.redirect('back')
            })
    },

    charging: async (req, res) => {
        try {
            const { token, amount } = req.body;
            const client = await users_model.findById(req.user.id);
            const customer = await stripe.customers.create({
                name: `${client.first_name} ${client.last_name}`,
                email: client.email,
                source: token
            })
            await stripe.charges.create({
                amount: amount * 100,
                currency: "uah",
                customer: customer.id
            })
            await users_model.findByIdAndUpdate(client._id, { $inc: { 'billing': amount } })
            res.redirect('back')
        } catch (error) {
            req.flash("error", error.message);
            res.send();
        }
    },

    registering_sending: async (req, res) => {
        const { weight, length, width, height, cost, department } = req.body;
        const client = req.user.id;
        new sendings_model(
            {
                'properties': `${weight} ${width} ${height} ${length}`,
                'cost': cost,
                "department": department,
                'client': client,
            }
        )
        .save()
        .then(async (data) => {
            console.log(data)
            users_model.findByIdAndUpdate(client, { $inc: { 'billing': cost * -1 } })
            .then(() => {
                req.flash('success', "Відправлення прийнято в обробку")
                res.send(data);
            })
            .catch((error) => {
                req.flash("error", error.message);
                res.send(error);
            })
        })
    },

   
}