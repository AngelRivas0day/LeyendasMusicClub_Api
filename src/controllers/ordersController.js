const controller = {};

controller.listAll = (req, res) => {
  function listAll(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('SELECT * FROM orders WHERE archived = 0', (err, rows) => {
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
      error: err
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
        'SELECT * FROM orders WHERE name LIKE ? AND archived = 0', 
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

controller.create = (req, res) => {
  const data = req.body;
  function create(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, connection) => {
        const query = connection.query('INSERT INTO orders set ?', data, (err, data) => {
          if(err){
            reject(err);
          }else{
            resolve(data);
          }
        })
      });
    });
  }
  create().then(rows=>{
    res.status(200).send({
      sucess: true,
      message: "There was no errors",
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

controller.confirm = (req, res) => {
  const { id } = req.params;
  function confirm(){
    req.getConnection((err, conn) => {
      conn.query("UPDATE orders set checked = 1 WHERE id = ?", [id], (err, rows) => {
        if(err){
          reject(err);
        }else{
          resolve(rows);
        }
      });
    });
  }
  confirm().then(rows=>{
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

controller.archive = (req, res) => {
  const { id } = req.params;
  function archive(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query("UPDATE orders set archived = 1 WHERE id = ?", [id], (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  archive().then(rows=>{
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

controller.delivered = (req, res) => {
  const { id } = req.params;
  function deliver(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query("UPDATE orders set delivered = 1 WHERE id = ?", [id], (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  deliver().then(rows=>{
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

controller.listOne = (req, res) => {
  const { id } = req.params;
  function listOne(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query("SELECT * FROM orders WHERE id = ?", [id], (err, rows) => {
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
  const newCustomer = req.body;
  function update(){
    return new Promise((resolve, reject)=>{
      req.getConnection((err, conn) => {
        conn.query('UPDATE orders set ? where id = ?', [newCustomer, id], (err, rows) => {
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
        connection.query('DELETE FROM orders WHERE id = ?', [id], (err, rows) => {
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });
      });
    });
  }
  deleteItem().then(rows=>{
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

module.exports = controller;
