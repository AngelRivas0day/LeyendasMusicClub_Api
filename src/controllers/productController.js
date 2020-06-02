const controller = {};
const fs = require("fs");
const path = require("path");
const cloudinary = require('../services/cloudinary');
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});
var multipleUpload = multer({ storage: storage }).array("images", 25);


controller.getAll = (req, res, next)=>{
  function get(){
		return new Promise(function(resolve, reject){
			req.getConnection((errCon, conn)=>{
				if(errCon){
					reject(errCon);
				}else{
					conn.query("SELECT * FROM products", (err, rows)=>{
						if(err){
							reject(err);
						}else{
							resolve(rows);
						}
					});
				}
			});
		});
	}
	get().then((rows)=>{
		res.status(200).send(rows);
	}).catch((err)=>{
    res.status(500).send({
      sucess: false,
      message: "There was an error",
      error: err
    })
		throw err;
	});
};

controller.listNewItems = (req, res) => {
  // res.send("Si jala el customer list");
  function getNew(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn)=>{
        if(err){
          reject(err);
        }else{
          conn.query("SELECT * FROM ( SELECT * FROM products ORDER BY id DESC LIMIT 4 ) sub ORDER BY id DESC",
          (err, rows)=>{
            if(err){
              reject(err);
            }else{
              resolve(rows);
            }
          });
        }
      });
    });
  };
  getNew().then((rows)=>{
    res.status(200).json(rows);
  }).catch((err)=>{
    res.status(500).send({
      success: false,
      message: "There was an error",
      error: err
    });
    throw err;
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

controller.create = (req, res) => {
  multipleUpload(req, res, async function (err) {


    const uploader = async (path) => await cloudinary.uploads(path, 'images');
    const urls = []
    const files = req.files;
    // console.log("Files: ", files);
    for (const file of files) {
      const { path } = file;
      // console.log('File path: ', file.path);
      const newPath = await uploader(path)
      urls.push(newPath);
      console.log('New path: ', newPath);
      fs.unlinkSync(path)
    }



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
      req.getConnection(async (err, conn) => {
        const query = conn.query(
          "INSERT INTO products SET ?",
          [data],
          async (err, rows) => {
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

controller.getOne = (req, res, next)=>{
  const { id } = req.params;
  function getOne(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn)=>{
        if(err){
          reject(err);
        }else{
          conn.query(
            "SELECT * FROM products WHERE id = ?",
            [id],
            (err, rows)=>{
              if(err){
                reject(err);
              }else{
                resolve(rows[0]);
              }
            }
          );
        }
      });
    });
  }
  getOne().then((row)=>{
    let colors = row.colors;
    let images = row.images;
    row.colors = JSON.parse(colors);
    row.images = JSON.parse(images);
    res.status(200).json(row);
  }).catch((err)=>{
    res.status(500).send({
      sucess: false,
      message: "There was an error",
      error: err
    })
		throw err;
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

controller.uploadImage = (req, res, next) => {
  function upload(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn)=>{
        if(err){
          reject(err);
        }else{
          multipleUpload(req, res, function (err){
            const id = req.params.id;
            var data = req.body;
            let images = req.files;
            let fileNames = {};
            var imageIndex = 0;
            let colors = JSON.parse(data.colors);
            Array.from(colors).forEach((color, i)=>{
              fileNames[color.name] = [images[imageIndex].filename,images[imageIndex+1].filename,images[imageIndex+2].filename];
              imageIndex = imageIndex + 3;
            });
            data.image = images[0].filename;
            data.images = JSON.stringify(fileNames);

            conn.query(
              "UPDATE products SET ? WHERE id = ?",
              [data, id],
              (err, rows)=>{
                if(err){
                  reject(err);
                }else{
                  resolve(rows);
                }
              }
            );
          });
        }
      });
    });
  };
  

  upload().then((rows)=>{
    res.status(200).json(rows);
  }).catch((err)=>{
    res.status(500).send({
      success: false,
      message: "There was an error",
      error: err
    });
    throw err;
  });
  
  // multipleUpload(req, res, function (err) {
  //   // Everything went fine
  //   req.getConnection((err, conn) => {
  //     const query = conn.query(
  //       "UPDATE products SET ? WHERE id = ?",
  //       [data, id],
  //       (err, rows) => {
  //         if(err){
  //           res.status(500).send({
  //             success: false,
  //             message: "There was an error",
  //             error: err
  //           })
  //         }else{
  //           res.status(200).send({
  //             success: true,
  //             message: "La info fue actulizada con exito",
  //             data: rows
  //           });
  //         }
  //       }
  //     );
  //   });
  // });
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
