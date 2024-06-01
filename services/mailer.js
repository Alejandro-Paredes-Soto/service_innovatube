require("dotenv").config()
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.PASSWORD_NODEMAILER
    },
    tls: {
        rejectUnauthorized: false
    }
})


exports.sendEmail = async (to, url) => {
   try {

      transport.sendMail({
        from: process.env.FROM_EMAIL,
        to: to,
        subject: "Innovatube",
        html:`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificar Cuenta</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body {
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .verification-container {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .btn-verify {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="verification-container">
            <h2>Verificación de Cuenta</h2>
            <p>Para continuar, haga clic en el botón a continuación para verificar su cuenta.</p>
            <a role="button" class="btn btn-primary btn-verify" href="${url}" target="_blank">Verificar Cuenta</a>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
        </body>
        </html>
        
        `
      }, (err, info) => {
        
        if (err) return err.message
        else return info
      })
    
   } catch (error) {
      return error.message;
   }
}