var multer = require('multer');
const fs = require('fs');
const path = require('path');
const controller = {};

controller.listAll = (req, res) => {
    // res.send("Si jala el customer list");
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM gameCategories WHERE type = 1', (err, gameCategories) => {
            if(err){
                res.send("Hubo un error");
            }
            console.log(gameCategories);
            res.json(gameCategories);
        });
    });;
};

controller.listDataTable = (req, res) => {
  serachPattern = req.body.search.value;
  req.getConnection((err, conn) => {
    const query = conn.query(
    'SELECT * FROM gameCategories WHERE name LIKE ? AND type = 1', 
    [`%${serachPattern}%`], 
    (err, resp) => {
        if(err){
            res.send("Hubo un error");
        }
        res.json(resp);
    });
  });
};

controller.create = (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    const query = conn.query('INSERT INTO gameCategories SET ?', [data], (err, rows) => {
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
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM gameCategories WHERE id = ?", [id], (err, rows) => {
    res.json(rows);
    if(err){
      res.status(500).send({
        success: false,
        message: 'Hubo un error',
        error: err
      });
    }else{
      res.json(rows);
    }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {
    conn.query('UPDATE gameCategories set ? where id = ?', [newCustomer, id], (err, rows) => {
      if(err){
        res.status(500).send({
          success: false,
          message: 'Hubo un error',
          error: err
        });
      }else{
        res.status(500).send({
          success: true,
          message: 'The game cat was updated succesfully',
          data: rows
        });
      }
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
      connection.query('DELETE FROM gameCategories WHERE id = ?', [id], (err, rows) => {
        if(err){
          res.status(500).send({
            success: false,
            message: 'Hubo un error',
            error: err
          });
        }else{
          res.status(500).send({
            success: true,
            message: 'The game cat was deleted succesfully',
            data: rows
          });
        }
      });
    });
};

module.exports = controller;
