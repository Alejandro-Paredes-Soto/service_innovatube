require("dotenv").config()
const { queryAsync } = require("../database");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.forgotPassword = async (req, res) => {

    const { email } = req.body;
  try {
    const searchUser = await queryAsync(`SELECT idUser, email, password FROM users WHERE email = '${email}'`)
     
    if (searchUser.rowCount == 0) {
    
      return res.status(400).json({ status: 400, message: "Usuario no encontrado" });
    }

    const secret = `${process.env.SECRET_TOKEN}${searchUser.rows[0].password}`;

    const token = jwt.sign({ email, id: searchUser.rows[0].iduser }, secret, {
      expiresIn: "5m",
    });
    const link = `https://service-innovatube.onrender.com/api/v1/password/reset-password/${searchUser.rows[0].iduser}/${token}`;

    return res.status(200).json({
        status: 200,
        message: link
    })
  } catch (error) {
    return res.status(500).json({
        status: 500,
        message: "Error interno del servidor"
    })

    }
}

exports.resetPassword = async (req, res) => {

     const { idUser, tokenUser } = req.params;


    try {
        const searchUser = await queryAsync(`
        SELECT iduser, password FROM users WHERE iduser = ${idUser}
    `)

        if (searchUser.rowCount == 0) {
      
            return res.status(400).json({
            status: 400,
            message: 'Usuario no encontrado'
            })
        }

        const secret = `${process.env.SECRET_TOKEN}${searchUser.rows[0].password}`

      try {
         jwt.verify(tokenUser, secret);
         res.render("index")
        
      } catch (error) {
        res.render("errorPage")
      }

        
    } catch (error) {
        
    }


}

exports.resetPasswordFn = async (req, res) => {
    const { idUser, tokenUser } = req.params;
    const { password } = req.body;


    try {
        
      const searchUser = await queryAsync(`SELECT iduser, password FROM users WHERE iduser = ${idUser}`)

      if (searchUser.rowCount == 0) return res.status(400).json({status: 400, message: "Usuario no encontrado"});

      const secret = `${process.env.SECRET_TOKEN}${searchUser.rows[0].password}`

      try {
        jwt.verify(tokenUser, secret);
        const hasPassword = await bcrypt.hash(password, 10);

        const updatePassword = await queryAsync(`
          UPDATE users SET password = '${hasPassword}' WHERE idUser = ${idUser}
        `)

        if (updatePassword.rowCount > 0) {
          return res.status(200).json({
            status: 200,
            message: "Contraseña actualizada"
          })
        }
      } catch (error) {

        
         
        return res.status(500).json({
            status: 500,
            message: error.message
        })
      }

    } catch (error) {
       
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}


