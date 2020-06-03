var multer = require('multer');
const fs = require('fs');
const path = require('path');
const controller = {};

controller.listAll = (req, res) => {
  function listAll(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('SELECT * FROM gameCategories WHERE type = 0', (err, rows) => {
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
  const serachPattern = req.body.search.value;
  function dataTables(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        const query = conn.query(
        'SELECT * FROM gameCategories WHERE name LIKE ? AND type = 0', 
        [`%${serachPattern}%`], 
        (err, resp) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  dataTables().then(rows=>{
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
