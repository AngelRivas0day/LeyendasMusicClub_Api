const controller = {};

controller.listAll = (req, res) => {
    // res.send("Si jala el customer list");
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM reservations WHERE achieved = 0', (err, resp) => {
            if(err){
                res.send("Hubo un error");
            }
            console.log(resp);
            res.json(resp);
        });
    });
};

controller.listDataTable = (req, res) => {
  serachPattern = req.body.search.value;
  req.getConnection((err, conn) => {
    const query = conn.query(
    'SELECT * FROM reservations WHERE name LIKE ? AND achieved = 0', 
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
    console.log(req.body)
    req.getConnection((err, connection) => {
    const query = connection.query('INSERT INTO reservations set ?', data, (err, data) => {
      console.log(data);
      if(err){
        res.status(500).send({
          status: "ok",
          message: "La reservación no fue creada con exito",
          error: [err]
        });
      }else{
        res.status(200).send({
          status: "ok",
          message: "La reservación fue creada con exito",
          data: [data]
        });
      }
    })
  });
};

controller.confirm = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("UPDATE reservations set arrived = 1 WHERE id = ?", [id], (err, rows) => {
    console.log(rows);
    res.json(rows);
    });
  });
};

controller.achieve = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("UPDATE reservations set achieved = 1 WHERE id = ?", [id], (err, rows) => {
    console.log(rows);
    res.json(rows);
    });
  });
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM reservations WHERE id = ?", [id], (err, rows) => {
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
    conn.query('UPDATE reservations set ? where id = ?', [newCustomer, id], (err, rows) => {
      res.status(200).send({
          status: "ok",
          message: "La reservación fue actualizada con exito",
          data: rows
      });
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
      connection.query('DELETE FROM reservations WHERE id = ?', [id], (err, rows) => {
        res.status(200).send({
            status: "ok",
            message: "La reservación fue eliminada con exito",
            data: rows
        });
      });
    });
};

module.exports = controller;
