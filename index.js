const express = require('express')
const app = express()
const flash = require('connect-flash')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session');

require("dotenv").config();
const secret = process.env.SECRET

app.set('view engine', 'ejs');
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser(secret));
app.use(session({
  secret: secret,
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});





const path = require('path')
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://gpost9:${process.env.MONGO_PASSWORD}@cluster0.ic56e0a.mongodb.net/?retryWrites=true&w=majority`);
mongoose.connection.once("open", () => console.log('Database is connected'));

const admin_verify = require('./controllers/admin_verify');
const user_verify = require('./controllers/user_verify');
const worker_verify = require('./controllers/worker_verify');
const spec_verify = require('./controllers/spec_verify');
const simple_verify = require('./controllers/simple_verify');


const auth = require('./controllers/auth');
const user = require('./controllers/user');
const admin = require('./controllers/admin');
const department = require('./controllers/department');
const worker = require('./controllers/worker');

app.get('/', (req, res) => res.render('pages/landing'))
app.get('/login', auth.login)
app.get('/registration', auth.registration)
app.post('/login', auth.login_action)
app.post('/registration', auth.registration_action)

app.get('/admin', admin_verify, admin.main)

app.get('/logout', auth.logout)
app.get('/statistic', admin_verify, admin.statistic)

app.get('/user', user_verify, user.main)
app.post('/charging', user_verify, user.charging)
app.post('/registeringSending', user_verify, user.registering_sending)
app.post('/updatePassword', simple_verify, auth.update_password)

app.post('/addDepartment', admin_verify, department.add);
app.post('/editDepartment', admin_verify, department.edit);
app.post('/deleteDepartment', admin_verify, department.delete);

app.get('/department/:id', admin_verify, department.main)

app.post('/deleteClient', admin_verify, admin.delete_client);
app.post('/generateStatistic', admin_verify, admin.generate_statistic)
app.get('/worker', worker_verify, worker.main)

app.post('/addWorker', admin_verify, worker.add);
app.post('/editWorker', admin_verify, worker.edit);
app.post('/deleteWorker', admin_verify, worker.delete);

app.post('/changeStatus', spec_verify, admin.change_status)

app.get("/getStatisticPDF/:fileName", (req, res) => {
  let fileName = req.params.fileName;
  let filePath =`${__dirname}/statistics/${fileName}`;
  res.download(filePath);
});

const server = app.listen(app.get("port"), console.log('App is running'))
const io = require('socket.io')(server);
const chatCTR = require('./controllers/sockets')(io);