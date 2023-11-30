const users_model = require('../models/user.js');
const sendings_model = require('../models/sending.js');
const departments_model = require('../models/department.js');
const PDFDocument = require('pdfkit'),
http = require('http'),
path = require('path'),
fs = require('fs');

require("dotenv").config();

module.exports = {

    main: (req, res) => {
        users_model
        .findById(req.user.id)
        .then(async(client) => {
            const dep_arr = await departments_model.find();
            const workers_arr = await users_model.find({status: 1});
            const clients_model_arr = await users_model.find({status: 2});
            
            let clientsArr = [];
            clients_model_arr.forEach(async(e) => {
                const clientObj = e.toJSON();
                clientObj.sendings_count = await sendings_model.find({'client': e._id}).count();
                clientsArr.push(clientObj);
                if(clientsArr.length == clients_model_arr.length){
                    
                    res.render('pages/admin', { 
                        clientObj: client, 
                        dep_arr: dep_arr,
                        workers_arr: workers_arr,
                        clients_arr: clientsArr,
                    })
                }
            })
           
           
        })
        .catch((error) => {
            req.flash("error", error.message);
            res.redirect('back')
        })
    },

    change_status: (req, res) => {
        const {status, sending_id} = req.body;
        sendings_model.findByIdAndUpdate(sending_id, {'status': status})
        .then(() => res.send())
        .catch((error) => {
            req.flash(error.message)
            res.send()
        })
    },

    delete_client: (req, res) => {
        const {id} = req.body;
        users_model.findByIdAndDelete(id)
        .then(_ => res.send(200))
        .catch((error) => {
            req.flash('error', error.message)
            res.send(500)
        })
    },

    statistic: (req, res) => {
        sendings_model.find()
        .populate({path: 'department'})
        .sort({ date: 1, status: 1 })
        .then((data) => {
            res.render('pages/statistic', {
                sendings: data
            })
        })
        .catch((error) => {
            req.flash(error.message)
            res.redirect('back')
        })
    },

    generate_statistic: async(req, res) => {
        console.log('generate statistic')
        const doc = new PDFDocument({compress:false});
        let fileName = `статистика.pdf`; 
        let fontPath = path.join(__dirname, `../public/fonts/timesnrcyrmt.ttf`);
        const writeStream = fs.createWriteStream('statistics/' + fileName);
        doc.pipe(writeStream);
        doc
            .font(fontPath)
            .fontSize(36)
            .text('Статистика', 200, 20)
            .fontSize(14)
        doc.image(req.body.lineChart, 60, 60, {align: 'center', height: 200, width: 500});
        doc.text('Графік відправлень', 60, 250);

        doc.image(req.body.pieChart, 60, 320, {align: 'center', height: 200,width: 390});
        doc.text('Діаграма відділень', 60, 520);

        doc.text('Загальна кількість оформлених відправлень: ' + req.body.count, 60, 590)
           .text("Дата: " + new Date().toLocaleDateString(), 60, 700);
        doc.end()
        writeStream.on('finish', function () {
            res.json({path: `/getStatisticPDF/${fileName}`});
        });
    }
}