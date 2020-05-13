const controller = {};
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

controller.register = async (req, res) => {
    let data = req.body;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10, (err, hash)=>{
        if(!err && name != "" && email != ""){
            req.getConnection((err, conn) => {
                req.body.password = hash;
                const query = conn.query('INSERT INTO user set ?', data, (err, data) => {
                  console.log(data);
                  res.json(data);
                })
            });
        }else{
            res.status(500).send({
                message: "Hubo un error al crear el usuario"
            });
        }
    });
        // data.password = hashedPassword;

};

controller.login = (req, res) => {
    let data = req.body;
    const password = req.body.password;

    req.getConnection((err, conn)=>{
        const query = conn.query('SELECT * FROM user where email = ?', data.email, (err, data)=>{
            console.log(data[0].password);
            bcrypt.compare(password, data[0].password, (err, check)=>{
                console.log(check);
                if(check){
                    res.status(200).json({
                        success: true,
                        token: jwt.createToken(data[0])
                    });
                }else{
                    res.status(403).send({
                        message: "Password incorrrecto"
                    })
                }
            })
        });
    })
};

module.exports = controller;
