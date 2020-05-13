var multer = require('multer');
const fs = require('fs');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/carousel')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});
var upload = multer({ storage: storage }).single('image');
var multipleUpload = multer({ storage: storage }).array('images', 10);

const controller = {};

controller.listAll = (req, res) => {
    // res.send("Si jala el customer list");
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM carousel', (err, rows) => {
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
    var data = req.body;
    upload(req, res, function (err) {
        let image = req.file.filename;
        data.image = image;
        if (err) {
            res.status(500).send({
                message: 'La info no fue actulizada con exito'
            });
        }else{
            req.getConnection((err, conn) => {
                const query = conn.query('INSERT INTO carousel set ?', [data], (err, rows) => {
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
    conn.query("SELECT * FROM carousel WHERE id = ?", [id], (err, rows) => {
        if(err){
            res.status(500).send({
                success: false,
                message: "Hubo un error",
                error: err
            });
        }else{
            res.status(200).send({
                success: true,
                message: "Ok",
                data: rows[0]
            });
        }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const path = 'src/uploads/carousel';
    req.getConnection((err, connection) => {
        connection.query('SELECT * FROM carousel WHERE id = ?', [id], (error, response)=>{
            console.log("image:");
            console.log(response[0].image);
            const imageToDelete = response[0].image;
            fs.unlink(`${path}/${imageToDelete}`, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Se borro la foto");
                }
            });
        });
    });
    multipleUpload(req, res, function (err) {
        let images = req.files;
        let fileNames = [];
        Array.from(images).forEach(image => {
        console.log(image);
        fileNames.push(image.filename);
        });
        data.image = fileNames[0];
        data.images = JSON.stringify(fileNames);
        if (err) {
            res.status(500).send({
                message: 'La info no fue actulizada con exito'
            });
        }else{
            req.getConnection((err, conn) => {
                const query = conn.query('UPDATE carousel set ? where id = ?', [data, id], (err, rows) => {
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

controller.delete = (req, res) => {
    const { id } = req.params;
    const path = 'src/uploads/carousel';
    req.getConnection((err, connection) => {
        connection.query('SELECT * FROM carousel WHERE id = ?', [id], (error, response)=>{
            console.log("image:");
            console.log(response[0].image);
            const imageToDelete = response[0].image;
            fs.unlink(`${path}/${imageToDelete}`, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Se borro la foto");
                }
            });
        });
    });
    req.getConnection((err, connection) => {
        connection.query('DELETE FROM carousel WHERE id = ?', [id], (err, rows) => {
            if(err){
                res.status(500).send({
                    success: false,
                    message: "Hubo un error",
                    error: err
                });
            }else{
                res.status(200).send({
                    success: true,
                    message: "Ok",
                    data: rows
                });
            }
        });
    });
};

controller.uploadImage = (req, res) => {
    const {id} = req.params;
    const path = 'src/uploads/carousel';
    req.getConnection((err, connection) => {
        connection.query('SELECT * FROM carousel WHERE id = ?', [id], (error, response)=>{
            console.log("image:");
            console.log(response[0].image);
            const imageToDelete = response[0].image;
            fs.unlink(`${path}/${imageToDelete}`, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Se borro la foto");
                }
            });
        });
    });
    upload(req, res, function (err) {
        if (err) {
            res.status(500).send({
                message: 'La foto no fue actulizada con exito'
            });
        }
        // Everything went fine
        const fileName = req.file.filename;
        req.getConnection((err, conn) => {
              const query = conn.query('UPDATE carousel SET image = ? WHERE id = ?', [fileName, id], (err, rows) => {
                res.status(200).send({
                    message: 'La foto fue actulizada con exito'
                });
            });
        });
    })
};

controller.getImage = (req, res) => {
  const fileName = req.params.fileName;
  var filePath = 'src/uploads/carousel/' + fileName;
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
