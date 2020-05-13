const controller = {};

controller.listAll = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM colors', (err, colors) => {
            if(err){
                res.send("Hubo un error");
            }
            console.log(colors);
            res.json(colors);
        });
    });;
};

controller.listDataTable = (req, res) => {
    serachPattern = req.body.search.value;
    req.getConnection((err, conn) => {
        const query = conn.query(
        'SELECT * FROM colors WHERE name LIKE ?', 
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
        const query = conn.query('INSERT INTO colors SET ?', [data], (err, rows) => {
            if(err){
                res.status(500).send({
                    success: false,
                    message: "El color no fue creado",
                    error: err
                });
            }else{
                res.status(200).send({
                    success: true,
                    message: "El color fue creado",
                    data: rows
                });
            }
        });
    });
};

controller.listOne = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM colors WHERE id = ?", [id], (err, rows) => {
        if(err){
            res.status(500).send({
                success: false,
                message: "El color no pudo ser listado",
                error: err
            });
        }else{
            res.status(200).json(rows);
        }
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  req.getConnection((err, conn) => {
    conn.query('UPDATE colors set ? where id = ?', [data, id], (err, rows) => {
        if(err){
            res.status(500).send({
                success: false,
                message: "El color no fue creado",
                error: err
            });
        }else{
            res.status(200).send({
                success: true,
                message: "El color fue creado",
                data: rows
            });
        }
    });
  });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
      connection.query('DELETE FROM colors WHERE id = ?', [id], (err, rows) => {
        if(err){
            res.status(500).send({
                success: false,
                message: "El color no fue eliminado",
                error: err
            });
        }else{
            res.status(200).send({
                success: true,
                message: "El color fue eliminado",
                data: rows
            });
        }
      });
    });
};

module.exports = controller;
