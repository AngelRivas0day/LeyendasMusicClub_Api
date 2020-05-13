// const express = require('express');
// const morgan = require('morgan');
// const app = express();
// const cors = require('cors');
// const path = require('path');
// const mysql = require('mysql');
// const myConnection = require('express-myconnection');
// var bodyParser = require('body-parser');
// const session = require('express-session');

// // importing routes
// const productRoutes = require('./routes/product');
// const eventRoutes = require('./routes/event');
// const gameRoutes = require('./routes/games');
// const adminRoutes = require('./routes/admin');
// const reservationRoutes = require('./routes/reservations');
// const machineRoutes = require('./routes/machines');
// const orderRoutes = require('./routes/order');
// const gamesCategoriesRoutes = require('./routes/gamesCategories');
// const juegosCategoriesRoutes = require('./routes/juegosCategories');
// const colorRoutes = require('./routes/color');
// const carouselRoutes = require('./routes/carousel');

// // settings
// const PORT =  process.env.PORT || 3000;

// // middleware
// app.use(morgan('dev'));
// app.use(cors(
//     'Access-Control-Allow-Origin: *'
// ));

// app.use(myConnection(mysql, {
// 	host: 'us-cdbr-east-06.cleardb.net',
// 	user: 'b7a012a450a854',
// 	password: 'f2b590f1',
// 	port: 8889,
//   database: 'heroku_6c5270acb0de78a',
//   timeout: 60000
// }));
// app.use(express.urlencoded({
// 	extended: false
// }));
// app.use(express.json());
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }))
// app.use(bodyParser.urlencoded({extended : false}));
// app.use(bodyParser.json());

// // routes
// app.use('/products', productRoutes);
// app.use('/events', eventRoutes);
// app.use('/games', gameRoutes);
// app.use('/admin', adminRoutes);
// app.use('/reservations', reservationRoutes);
// app.use('/machines', machineRoutes);
// app.use('/orders', orderRoutes);
// app.use('/gamesCategories', gamesCategoriesRoutes);
// app.use('/machinesCategories', juegosCategoriesRoutes);
// app.use('/colors', colorRoutes);
// app.use('/carousel', carouselRoutes);
// app.use("/", (req, res)=>{
//   req.getConnection((err, conn) => {
//     conn.query("SELECT * FROM products", (err, prods) => {
//       if (err) {
//         res.send({
//           error: err,
//           success: false
//         });
//       }else{
//         console.log(prods);
//         res.json(prods);
//       }
//     });
//   });
// });

// // static files
// // app.use(express.static(path.join(__dirname, 'public')));

// app.listen(PORT, () => {
//     console.log("server running in port 3000");
// });

const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
	user: 'b7a012a450a854',
	password: 'f2b590f1',
	port: 8889,
  database: 'heroku_6c5270acb0de78a'
});

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// all customers
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/add', (req, res) => {
  const sql = 'INSERT INTO products SET ?';

  const customerObj = {
    name: req.body.name,
    city: req.body.city
  };

  connection.query(sql, customerObj, error => {
    if (error) throw error;
    res.send('Customer created!');
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql = `UPDATE products SET name = '${name}', city='${city}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Customer updated!');
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Delete customer');
  });
});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
