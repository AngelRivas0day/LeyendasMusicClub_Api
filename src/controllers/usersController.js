const controller = {};

controller.listAll = (req, res) => {
    // res.send("Si jala el customer list");
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users', (err, rows) => {
            if(err){
                res.send("Hubo un error");
            }
            console.log(rows);
            res.json(rows);
        });
    });;
};

controller.create = (req, res) => {
    const data = req.body;
    console.log(req.body)
    req.getConnection((err, connection) => {
    const query = connection.query('INSERT INTO users set ?', data, (err, data) => {
      console.log(data);
      res.redirect('/');
    })
  });
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
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
    conn.query('UPDATE users set ? where id = ?', [newCustomer, id], (err, rows) => {
      res.redirect('/');
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
      connection.query('DELETE FROM users WHERE id = ?', [id], (err, rows) => {
        res.redirect('/');
      });
    });
};

module.exports = controller;
