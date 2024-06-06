const { methodGet, methodPost } = require('../services/index')
const { queryAsync } = require("./../database")

exports.getListVideos = async (req, res) => {

    try {
        const { token } = req.query;

        const response = await methodGet('videos', token);
        return  res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }

}

exports.searchVideo = async (req, res) => {
   try {

    const {searchClientVideo, token} = req.body;
    
    const response = await methodPost('search', `part=snippet&type=video&q=${searchClientVideo}&maxResults=10`, token);

    return res.status(200).json(response);
   } catch (error) {
    return res.status(500).json({
        status: 500,
        message: error.message
    })
   } 
}

exports.favoriteVideo = async (req, res) => {
    try {

        const { idUser, idVideo, title } = req.body


        const isExistVideo = await queryAsync(`
          SELECT idvideo FROM videos WHERE url = '${idVideo}'
        `)

        if (isExistVideo.rowCount > 0) {
          return res.status(201).json({
            status: 201,
            message: "Este video ya lo tienes como favorito"
          })
        } else {

            
        const insertVideo = await queryAsync(`
        INSERT INTO videos (title,url, date_create) VALUES 
        ('${title}','${idVideo}', NOW()) RETURNING idvideo
      `)


      if (insertVideo && insertVideo.rowCount > 0) {
         
          const insertFavorite = await queryAsync(`
           INSERT INTO favorites (user_id, video_id, date_add, active)
           VALUES(${idUser}, ${insertVideo.rows[0].idvideo}, NOW(), 1) 
          `)

          if (insertFavorite && insertFavorite.rowCount > 0) {
            return res.status(200).json({
              status: 200,
              message: "Video agregado a favoritos correctamente"
            })
          } else {
              return res.status(400).json({
                  status: 400,
                  message: "No se pudo agregar a favoritos, intentalo de nuevo"
              })
          }

         
      } else {
          return res.status(400).json({
              status: 400,
              message: "No se pudo agregar el video, intentalo de nuevo"
          })
  
      }
        }


        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

exports.getListVideosFavorites = async (req, res) => {

     try {
        const { idUser } = req.query;
    
    const result = await queryAsync(`
      SELECT videos.url AS id, videos.title FROM  videos
 
      INNER JOIN favorites ON videos.idVideo = favorites.video_id 
 
      WHERE user_id = ${idUser} AND active = 1
    `)

            return res.status(200).json({
                status: 200,
                json: result
            })
            
     } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        })
     }

}

exports.removeFavoriteVideo = async (req, res) => {
  
     const { idUser, idVideo } = req.body
    try {

        const selectVideo = await queryAsync(
            `
            SELECT idFavorite FROM favorites
            INNER JOIN videos ON favorites.video_id = videos.idVideo
            INNER JOIN users ON favorites.user_id = users.idUser
            
            WHERE users.iduser = ${idUser} AND videos.url = '${idVideo}'
            `
        )

        if (selectVideo && selectVideo.rowCount > 0) {
            const result = await queryAsync(`
              UPDATE favorites SET active = 0 WHERE idFavorite = ${selectVideo.rows[0].idfavorite}
            `);

            if (result.rowCount > 0) {
               
                const dataREsult = await queryAsync(`
                SELECT videos.url AS id, videos.title FROM videos
 
                INNER JOIN favorites ON videos.idVideo = favorites.video_id 
           
                WHERE user_id = ${idUser} AND active = 1
                `)

                return res.status(200).json({
                    status: 200,
                    json: dataREsult
                })
            }
        }
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}