const controller = {};

controller.listAll = (req, res) => {
  function listAll(){
    return new Promise((resolve, reject)=>{
			req.getConnection((err, conn) => {
				conn.query('SELECT * FROM colors', 
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
				'SELECT * FROM colors WHERE name LIKE ?', 
					[`%${serachPattern}%`], 
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
	dataTables().then(rows=>{
		res.status(200).json(rows);
	}).catch(err=>{
		res.status(500).send({
			success: false,
			message: 'There was an error',
			error: [err]
		})
		throw err;
	});
};

controller.create = (req, res) => {
	const data = req.body;
	function create(){
		return new Promise((resolve, reject)=>{
			req.getConnection((err, conn) => {
				const query = conn.query('INSERT INTO colors SET ?', 
				[data],
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
	create().then(rows=>{
		res.status(200).send({
			success: true,
			message: 'There is no errors',
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
				conn.query("SELECT * FROM colors WHERE id = ?", 
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
