var multer = require('multer');
const fs = require('fs');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/events')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});
var upload = multer({ storage: storage }).single('image');

const controller = {};

controller.listAll = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM events', (err, rows) => {
      if(err){
        res.status(500).send({
          success: false,
          message: "Hubo un error",
          error: err
        });
      }else{
        res.status(200).json(rows);
      }
    });
  });;
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
          const query = conn.query('INSERT INTO events SET ?', [data], (err, rows) => {
            if(err){
              console.log(err);
              res.status(500).send({
                success: false,
                message: "El evento no fue creado",
                data: rows
              });
            }else{
              res.status(200).send({
                success: true,
                message: "El evento fue creado",
                data: rows
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
    conn.query("SELECT * FROM events WHERE id = ?", [id], (err, rows) => {
      if(err){
        res.status(500).send({
          success: false,
          message: "Hubo un error",
          error: err
        });
      }else{
        res.status(200).json(rows[0]);
      }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const path = 'src/uploads/events';
  upload(req, res, (err)=>{
    var data = req.body;
    req.getConnection((err,conn)=>{
      if(req.file){
        conn.query('SELECT * FROM events WHERE id = ?', [id], (error, response)=>{
          const imageToDelete = response[0].image;
          fs.unlink(`${path}/${imageToDelete}`, (err)=>{
              if(err){
                  console.log(err);
              }else{
                  console.log("Se borro la foto");
              }
          });
        });
        const fileName = req.file.filename;
        data.image = fileName;
      }
      conn.query('UPDATE events set ? WHERE id = ?', [data, id], (err, rows) => {
        if(err){
          res.status(500).send({
            success: false,
            message: "Hubo un error",
            error: err
          });
        }else{
          res.status(200).send({
            success:true,
            message: "ok",
            rows: rows
          });
        }
      });
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    const path = 'src/uploads/events';
    req.getConnection((err, connection) => {
      connection.query('SELECT * FROM events WHERE id = ?', [id], (error, response)=>{
        const imageToDelete = response[0].image;
        fs.unlink(`${path}/${imageToDelete}`, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Se borro la foto");
            }
        });
      });
      connection.query('DELETE FROM events WHERE id = ?', [id], (err, rows) => {
        if(err){
          res.status(500).send({
            success: false,
            message: "Hubo un error",
            error: err
          });
        }else{
          res.status(200).send({
            success:true,
            message: "ok",
            rows: rows
          });
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
            const query = conn.query('UPDATE events SET imageUrl = ? WHERE id = ?', [fileName, id], (err, rows) => {
              if(err){
                res.status(500).send({
                  success: false,
                  message: "Hubo un error",
                  error: err
                });
              }else{
                res.status(200).send({
                  success:true,
                  message: "ok",
                  rows: rows
                });
              }
            });
        });
    })
};

controller.getImage = (req, res) => {
  const fileName = req.params.fileName;
  var filePath = 'src/uploads/events/' + fileName;
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
