const controller = {};
const fs = require('fs');
const path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/games')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});
var upload = multer({ storage: storage }).single('image');

controller.listAll = (req, res) => {
    // res.send("Si jala el customer list");
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM games WHERE type = 1', (err, games) => {
            if(err){
                res.send("Hubo un error");
            }
            console.log(games);
            res.json(games);
        });
    });;
};

controller.listDataTable = (req, res) => {
  serachPattern = req.body.search.value;
  req.getConnection((err, conn) => {
    const query = conn.query(
    'SELECT * FROM games WHERE name LIKE ? AND type = 1', 
    [`%${serachPattern}%`], 
    (err, resp) => {
        if(err){
            res.send("Hubo un error");
        }
        res.json(resp);
    });
  });
};

controller.listPerCategory = (req, res) => {
  req.getConnection((err, conn)=>{
    const query = conn.query('SELECT * FROM games WHERE type = 1', (err, data)=>{
      var dataToSend = [];
      if(err){
        res.status(500).send({
          success: false,
          message: 'Hubo un error',
          error: err
        });
      }else{
        var gamesResponse = [];
        var splitGames = function(data, category){
          var arrayOfGames = [];
          data.forEach(game => {
            if(game.category == category){
              arrayOfGames.push(game);
            }
          });
          return arrayOfGames;
        }
        var coopGames = splitGames(data, 'co-op');
        var vsGames = splitGames(data, '1vs1');
        var misteryGames = splitGames(data, 'mistery');
        gamesResponse.push(
          {category: "co-op", 'games':coopGames},
          {category: "1vs1",'games':vsGames},
          {category: 'mistery', 'games':misteryGames}
        );
        res.status(200).send({
          success: true,
          message: 'Juegos traidos por categoria',
          data: gamesResponse
        });
      }
    });
  });
};

controller.create = (req, res) => {
  upload(req, res, function (err) {
    console.log(req.body);
    let data = req.body;
    if (err) {
        res.status(500).send({
            message: 'La info no fue actulizada con exito'
          });
    }else{
      if(req.file){
        const fileName = req.file.filename;
        data.image = fileName;
      }else{
        data.image = "No seteado...";
      }
      req.getConnection((err, conn) => {
          const query = conn.query('INSERT INTO games SET ?', [data], (err, rows) => {
            if(err){
              console.log(err);
            }else{
              res.status(200).send({
                message: 'La into fue creada con exito'
              });
            }
          });
      });
    }
  });
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM games WHERE id = ?", [id], (err, rows) => {
    //   res.render('customers_edit', {
    //     data: rows[0]
    //   })
    console.log(rows);
    res.json(rows);
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {
    conn.query('UPDATE games set ? where id = ?', [newCustomer, id], (err, rows) => {
      res.redirect('/');
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
      connection.query('DELETE FROM games WHERE id = ?', [id], (err, rows) => {
        if(err){
          res.status(500).send({
            success: false,
            message: "Hubo un error"
          });
        }else{
          res.status(200).send({
            success: true,
            message: "El juego fue borrado con exito",
            rows: rows
          })
        }
      });
    });
};

controller.uploadImage = (req, res) => {
  const id = req.params.id;
    upload(req, res, function (err) {
        if (err) {
            res.status(500).send({
                message: 'La foto no fue actulizada con exito'
              });
        }
        // Everything went fine
        const fileName = req.file.filename;
        req.getConnection((err, conn) => {
            const query = conn.query('UPDATE games SET image = ? WHERE id = ?', [fileName, id], (err, rows) => {
              res.status(200).send({
                message: 'La foto fue actulizada con exito'
              });
            });
        });
    })
};

controller.getImage = (req, res) => {
  const fileName = req.params.fileName;
  var filePath = 'src/uploads/games/' + fileName;
  console.log(filePath);
  fs.exists(filePath, (exists)=>{
    if(exists){
      console.log(path.resolve(filePath));
      res.sendFile(path.resolve(filePath));
    }else{
      res.send({
        message: 'no existe'
      })
    }
  });
};

module.exports = controller;
