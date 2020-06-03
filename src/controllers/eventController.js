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
const cloudinary = require('../services/cloudinary');

const controller = {};

controller.listAll = (req, res) => {
  function listAll(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('SELECT * FROM events', (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  listAll().then(rows=>{
    res.status(200).json(rows);
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: "Hubo un error",
      error: [err]
    });
    throw err;
  });
};

controller.create = (req, res) => {
  function create(){
    return new Promise((resolve, reject)=>{
      upload(req, res, async function(err){
        const uploader = async (path) => await cloudinary.uploads(path, 'events');
        console.log(req.body);
        let data = req.body;
        if (err) {
          reject(err);
        }else{
          if(req.file){
            const fileName = req.file.filename;
            const { path } = file;
            const newPath = await uploader(path);
            fs.unlinkSync(path);
            console.log('New path: ', newPath);
            data.image = fileName;
          }else{
            data.image = "No seteado...";
          }
          req.getConnection((err, conn) => {
              const query = conn.query('INSERT INTO events SET ?', [data], (err, rows) => {
                if(err){
                  console.log(err);
                  reject(err);
                }else{
                  resolve(rows);
                }
              });
          });
        }
      });
    });
  }
  create().then(rows=>{
    res.status(200).send({
      success: true,
      message: 'There wasnt any errors',
      data: [rows]
    });
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: "Hubo un error",
      error: [err]
    });
    throw err;
  });
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  function listOne(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query("SELECT * FROM events WHERE id = ?", [id], (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows[0]);
          }
        });
      });
    });
  }
  listOne().then(rows=>{
    res.status(200).json(rows);
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: "Hubo un error",
      error: [err]
    });
    throw err;
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

// controller.getImage = (req, res) => {
//   const fileName = req.params.fileName;
//   var filePath = 'src/uploads/events/' + fileName;
//   console.log(filePath);
//   fs.exists(filePath, (exists)=>{
//     if(exists){
//       console.log(path.resolve(filePath));
//       res.sendFile(path.resolve(filePath));
//     }else{
//       res.send({
//         message: 'no existe'
//       })
//     }
//   });
// };

module.exports = controller;
