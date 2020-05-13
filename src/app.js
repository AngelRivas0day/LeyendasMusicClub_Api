const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
var bodyParser = require('body-parser');
const session = require('express-session');

// importing routes
const productRoutes = require('./routes/product');
const eventRoutes = require('./routes/event');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservations');
const machineRoutes = require('./routes/machines');
const orderRoutes = require('./routes/order');
const gamesCategoriesRoutes = require('./routes/gamesCategories');
const juegosCategoriesRoutes = require('./routes/juegosCategories');
const colorRoutes = require('./routes/color');
const carouselRoutes = require('./routes/carousel');

// settings
app.set('port', process.env.PORT || 3000);

// middleware
app.use(morgan('dev'));
app.use(cors(
    'Access-Control-Allow-Origin: *'
));

app.use(myConnection(mysql, {
	host: 'us-cdbr-east-06.cleardb.net',
	user: 'b7a012a450a854',
	password: 'f2b590f1',
	port: 8889,
	database: 'heroku_6c5270acb0de78a'
}, 'single'));
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
// app.use(express.bodyParser());

// routes
app.use('/products', productRoutes);
app.use('/events', eventRoutes);
app.use('/games', gameRoutes);
app.use('/admin', adminRoutes);
app.use('/reservations', reservationRoutes);
app.use('/machines', machineRoutes);
app.use('/orders', orderRoutes);
app.use('/gamesCategories', gamesCategoriesRoutes);
app.use('/machinesCategories', juegosCategoriesRoutes);
app.use('/colors', colorRoutes);
app.use('/carousel', carouselRoutes);
app.use("/", (req, res)=>{
  res.status(200).json({
    message: "it works"
  });
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log("server running in port 3000");
});
