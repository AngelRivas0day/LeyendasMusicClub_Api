const controller = {};
const fs = require("fs");
const path = require("path");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-borrar.jpg");
  },
});
var upload = multer({ storage: storage }).single("image");
var multipleUpload = multer({ storage: storage }).array("images", 25);

controller.list = (req, res) => {
  // res.send("Si jala el customer list");
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM products", (err, prods) => {
      if (err) {
        res.send("Hubo un error");
      }
      console.log(prods);
      res.json(prods);
    });
  });
};

controller.multipleImage = (req, res) => {
  const { id } = req.params;
  multipleUpload(req, res, function (err) {
    console.log(req.body);
    console.log(req.file);
    console.log(req.files);
    var data = req.body;
    let colors = req.body.colors;
    let images = req.files;
    let fileNames = [];
    images.forEach((image) => {
      fileNames.push(image.filename);
    });
    data.images = JSON.stringify(fileNames);
    data.colors = JSON.stringify([colors]);
    req.getConnection((err, conn) => {
      const query = conn.query(
        "UPDATE products SET ? WHERE id = ?",
        [data, id],
        (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send({
              message: "La into fue creada con exito",
            });
          }
        }
      );
    });
  });
};

controller.listNewItems = (req, res) => {
  // res.send("Si jala el customer list");
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT * FROM ( SELECT * FROM products ORDER BY id DESC LIMIT 4 ) sub ORDER BY id DESC",
      (err, prods) => {
        if (err) {
          res.send("Hubo un error");
        }
        console.log(prods);
        res.json(prods);
      }
    );
  });
};

controller.listDataTable = (req, res) => {
  serachPattern = req.body.search.value;
  req.getConnection((err, conn) => {
    const query = conn.query(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${serachPattern}%`],
      (err, resp) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: "There was an error",
            error: err
          });
        }else{
          res.status(200).json(resp);
        }
      }
    );
  });
};

controller.add = (req, res) => {
  multipleUpload(req, res, function (err) {
    var data = req.body;
    let images = req.files;
    let fileNames = {};
    var imageIndex = 0;
    // console.log("body:", data);
    // console.log("Images:", images.length);
    let colors = JSON.parse(data.colors);
    // console.log("Colors",colors);
    Array.from(colors).forEach((color, i)=>{
      fileNames[color.name] = [images[imageIndex].filename,images[imageIndex+1].filename,images[imageIndex+2].filename];
      imageIndex = imageIndex + 3;
    });
    data.image = images[0].filename;
    data.images = JSON.stringify(fileNames);
    if (err) {
      res.status(500).send({
        message: "La info no fue actulizada con exito",
      });
    } else {
      req.getConnection((err, conn) => {
        const query = conn.query(
          "INSERT INTO products SET ?",
          [data],
          (err, rows) => {
            if (err) {
              res.status(500).send({
                success: false,
                message: "There was an error",
                error: err
              })
            } else {
              res.status(200).send({
                sucess: true,
                message: "La into fue creada con exito",
                data: rows
              });
            }
          }
        );
      });
    }
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM products WHERE id = ?", [id], (err, rows) => {
      if (err) {
        res.status(500).status({
          success: false,
          message: "Hubo un error",
          error: err,
        });
      } else {
        let colors = rows[0].colors;
        let images = rows[0].images;
        rows[0].colors = JSON.parse(colors);
        rows[0].images = JSON.parse(images);
        res.status(200).json(rows[0]);
      }
    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  
  // console.log(newData);
  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE products set ? where id = ?",
      [newData, id],
      (err, rows) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: "Hubo un error al actualizar la información",
            error: err,
          });
        } else {
          res.status(200).send({
            success: true,
            message: "ok",
          });
        }
      }
    );
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, connection) => {
    const query = connection.query(
      "DELETE FROM products WHERE id = ?",
      [id],
      (err, rows) => {
        res.status(200).send({
          success: true,
          message: "El producto se ha eliminado",
          rows: rows,
        });
      }
    );
  });
};

controller.uploadImage = (req, res) => {
  multipleUpload(req, res, function (err) {
    const id = req.params.id;
    var data = req.body;
    let images = req.files;
    let fileNames = {};
    var imageIndex = 0;
    console.log("body:", data);
    console.log("Images:", images.length);
    let colors = JSON.parse(data.colors);
    console.log("Colors",colors);
    Array.from(colors).forEach((color, i)=>{
      fileNames[color.name] = [images[imageIndex].filename,images[imageIndex+1].filename,images[imageIndex+2].filename];
      imageIndex = imageIndex + 3;
    });
    data.image = images[0].filename;
    data.images = JSON.stringify(fileNames);
    if (err) {
      res.status(500).send({
        message: "La foto no fue actulizada con exito",
      });
    }
    // Everything went fine
    req.getConnection((err, conn) => {
      const query = conn.query(
        "UPDATE products SET ? WHERE id = ?",
        [data, id],
        (err, rows) => {
          if(err){
            res.status(500).send({
              success: false,
              message: "There was an error",
              error: err
            })
          }else{
            res.status(200).send({
              success: true,
              message: "La info fue actulizada con exito",
              data: rows
            });
          }
        }
      );
    });
  });
};

controller.getImage = (req, res) => {
  const fileName = req.params.fileName;
  var filePath = "src/uploads/products/" + fileName;
  console.log(filePath);
  fs.exists(filePath, (exists) => {
    if (exists) {
      console.log(path.resolve(filePath));
      res.sendFile(path.resolve(filePath));
    } else {
      res.send({
        message: "no existe",
      });
    }
  });
};

module.exports = controller;
