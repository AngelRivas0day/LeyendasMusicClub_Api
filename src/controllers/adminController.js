const controller = {};
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

controller.register = async (req, res) => {
    let data = req.body;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    function register(){
        return new Promise((resolve, reject)=>{
            const hashedPassword = await bcrypt.hash(password, 10, (err, hash)=>{
                if(!err && name != "" && email != ""){
                    req.getConnection((err, conn) => {
                        req.body.password = hash;
                        const query = conn.query('INSERT INTO users set ?', data, (err, rows) => {
                          if(err){
                              reject(err);
                          }else{
                              resolve(rows);
                          }
                        });
                    });
                }else{
                    reject(err);
                }
            });
        });
    }
    register().then(rows=>{
        res.status(200).json(rows);
    }).catch(err=>{
        res.status(500).send({
            message: "Hubo un error al crear el usuario",
            error: [err]
        });
        throw err;
    });
};

controller.login = (req, res) => {
    let data = req.body;
    const password = req.body.password;
    function login(){
        return new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                const query = conn.query('SELECT * FROM users where email = ?', data.email, (err, data)=>{
                    // console.log(data[0].password);
                    if(err){
                        reject(err);
                    }else{
                        bcrypt.compare(password, data[0].password, (err, check)=>{
                            if(check){
                                resolve(data[0].password);
                            }else{
                                reject(err);
                            }
                        });
                    }
                    
                });
            });
        });
    }
    login().then(data=>{
        res.status(200).json({
            success: true,
            token: jwt.createToken(data)
        });
    }).catch(err=>{
        res.status(403).send({
            message: "Password incorrrecto",
            error: [err]
        });
    });
};

module.exports = controller;
