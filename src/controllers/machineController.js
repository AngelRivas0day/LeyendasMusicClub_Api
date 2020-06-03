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
  function listAll(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('SELECT * FROM games WHERE type = 0', (err, rows) => {
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
      message: 'There was an error',
      error: [err]
    });
    throw err;
  });
};

controller.listDataTable = (req, res) => {
  serachPattern = req.body.search.value;
  function dataTables(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        const query = conn.query(
        'SELECT * FROM games WHERE name LIKE ? AND type = 0', 
        [`%${serachPattern}%`], 
        (err, resp) => {
          if(err){
            reject(err);
          }else{
            resolve(resp);
          }
        });
      });
    });
  }
  dataTables().then((rows)=>{
    res.status(200).json(rows);
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: "There was an error",
      error: err
    });
    throw err;
  });
};

controller.listPerCategory = (req, res) => {
  req.getConnection((err, conn)=>{
    const query = conn.query('SELECT * FROM games WHERE type = 0', (err, data)=>{
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
  function create(){
    return new Promise((resolve, reject)=>{
      upload(req, res, async function (err) {
        const uploader = async (path) => await cloudinary.uploads(path, 'maquinitas');
        console.log(req.body);
        let data = req.body;
        if (err) {
          reject(err);
        }else{
          if(req.file){
            const file = req.file;
            const { path } = file;
            const newPath = await uploader(path);
            fs.unlinkSync(path);
            console.log('New path: ', newPath);
            data.image = newPath.url;
          }else{
            data.image = "No seteado...";
          }
          req.getConnection((err, conn) => {
              const query = conn.query('INSERT INTO games SET ?',
              [data],
              (err, rows) => {
                if(err){
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
      sucess: true,
      message: "La into fue creada con exito",
      data: [rows]
    });
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: "There was an error",
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
        conn.query("SELECT * FROM games WHERE id = ?",
        [id],
        (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
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
      message: 'There was an error',
      error: [err]
    });
    throw err;
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  function update(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('UPDATE games set ? where id = ?',
        [newData, id],
        (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  update().then(rows=>{
    res.status(200).send({
      status: "ok",
      message: "There was no errors",
      data: [rows]
    });
  }).catch(err=>{
    res.status(500).send({
      success: false,
      message: 'There was an error',
      error: [err]
    });
    throw err;
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;
  function deleteItem(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, connection) => {
        connection.query('SELECT * FROM games WHERE id = ?', 
        [id], 
        async (error, response)=>{
          const destroyer = async(id) => await cloudinary.delete(id);
          var imageToDelete = response[0].image;
          imageToDelete = imageToDelete.split('/');
          let lastIndex = imageToDelete.length;
          var imageName = imageToDelete[lastIndex-1];
          var imageId = imageName.split('.');
          imageToDeleteId = imageToDelete[lastIndex-2] +"/"+ imageId[0];
          console.log("Image to delete: ", imageToDeleteId);
          let deletedImage = await destroyer(imageToDeleteId);
          console.log("Deleted image: ", deletedImage);
        });
        connection.query('DELETE FROM games WHERE id = ?',
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  deleteItem().then(rows=>{
    res.status(200).send({
      success:true,
      message: "There wasnt any errors",
      rows: [rows]
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

controller.uploadImage = (req, res) => {
  const id = req.params.id;
  var newPath;
  function uploadImg(){
    return new Promise((resolve, reject)=>{
      upload(req, res, async function (err) {
        const uploader = async (path) => await cloudinary.uploads(path, 'maquinitas');
        if (err) {
          reject(err);
        }
        // Everything went fine
        if(req.file){
          const file = req.file;
          const { path } = file;
          newPath = await uploader(path);
          fs.unlinkSync(path);
          console.log('New path: ', newPath);
        }else{
          newPath.url = "No seteado...";
        }
        req.getConnection((err, conn) => {
          const query = conn.query('UPDATE games SET image = ? WHERE id = ?',
          [newPath.url, id],
          (err, rows) => {
            if (err) {
              reject(err);
            }else{
              resolve(rows);
            }
          });
        });
      });
    });
  }
  uploadImg().then(rows=>{
    res.status(200).send({
      success: true, 
      message: "There wasnt any errors",
      data: [rows]
    });
  }).catch(err=>{
    res.status(500).send({
      success: false, 
      message: "There was an error",
      error: [err]
    });
    throw err;
  });
};

// controller.getImage = (req, res) => {
//   const fileName = req.params.fileName;
//   var filePath = 'src/uploads/games/' + fileName;
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
