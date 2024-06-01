require("dotenv").config()
const { queryAsync } = require('./../database/index')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


exports.login = async (req, res) => {
  
    const { nameUser, password } = req.body;

    try {
        
    
        const searchPassword = await queryAsync(`
          SELECT password, idUser FROM users WHERE name_user = '${nameUser}' OR email = '${nameUser}'
        `);
  
        if (searchPassword && searchPassword.rowCount > 0) {
           const passwordDB = searchPassword.rows[0].password;
            bcrypt.compare(password, passwordDB, (err, result) => {

            if (err) {
              
                return res.status(400).json({
                    status: 400,
                    message: "Erro al comparar contrasenas"
                })
            } else if (result) {

                const token = jwt.sign({ name: nameUser }, process.env.SECRET_TOKEN);

                return res.status(200).json({
                    status: 200,
                    message: "Logueado",
                    token,
                    nameUser,
                    idUser: searchPassword.rows[0].iduser
                })
            } else {
               
                return res.status(400).json({
                    status: 400,
                    message: "Contrasena incorrecta"
                })
            }
           })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Usuario " + nameUser + " no encontrado"
            })
        }

       
    } catch (error) {
        
        return res.status(500).json({
            status: 500,
            message: 'Ha ocurrido un error inesperado, intentalo de nuevo',
        })
    }
}


exports.registerUser = async (req, res) => {
    
    const { name, lastName, nameUser, password, password2, recaptcha, email } = req.body;
   
    
    try {
        if (!name || !lastName || !nameUser || !password || recaptcha == false || !email) return res.status(400).json({
            status: 400,
            message: "Completa los campos"});

            if  (password != password2) return res.status(400).json({
                status: 400,
                message: "Contraseñas no coinciden"
            }) 

            const isExistNameUser = await queryAsync(`
              SELECT name_user FROM users WHERE name_user = '${nameUser}' 
            `)

            if (isExistNameUser && isExistNameUser.rowCount > 0) {
               return res.status(201).json({
                status: 201,
                message: "Ya existe un nombre de usuario llamado " + nameUser
               })
            } 

            const passwordEncript = bcrypt.hashSync(password, 10);

            const consult = await queryAsync(`
            INSERT INTO users (name, last_name, name_user, password, date_create, email)
            VALUES ('${name}', '${lastName}','${nameUser}', '${passwordEncript}', NOW(), '${email}')
        `, )

       if (consult && consult.rowCount > 0) {
         return res.status(200).json({
            status: 200,
            message: "OK"
         })
       } else {
       
        return res.status(400).json({
            status: 400,
            message: "Error, no fue posible registrarte, intentalo de nuevo"
        })
       }
        
    } catch (error) {
       
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }


}

exports.logout = async (req, res) => {

        const token = req.header('Authorization')
      
       if (token) {
           new Set().add(token); 
          res.json({ message: 'Sesion cerrada' });
        } else {
          res.status(400).json({ message: 'No token provided.' });
        }

}

