require("dotenv").config()
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const token = req.header('Authorization');
    
    if(!token) return res.status(401).send('Acceso denegado, no estas autenticado');

    if (new Set().has(token)) {
        return res.status(401).json({ message: 'Acceso denegado, token removido' });
      }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "Invalid token"
        })
    }
}