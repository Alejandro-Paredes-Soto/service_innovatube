require('dotenv').config();
const axios = require('axios').default;

const URL_BASE = "https://www.googleapis.com/youtube/v3"

const methodGet = async (url, token) => {
  try {
    const response = await axios.get(`${URL_BASE}/${url}?key=${process.env.KEY_YOUTUBE}&part=snippet&chart=mostPopular&maxResults=50`, {
        headers: {
            Authorization: token
        }
    });

    const json = await response.data;

    const status = await response.status;
    
    return {
        status,
        body: json,
        message: "OK"
    }
  } catch (error) {
   
    return {
        status: 500,
        message: error.message
    }
  }
}

const methodPost = async (url, params, token) => {
    try {
      const response = await axios.get(`${URL_BASE}/${url}?key=${process.env.KEY_YOUTUBE}&${params}`, {
        headers: {
            Authorization: token
        }
      });
  
      const json = await response.data;
  
      const status = await response.status;
      
      return {
          status,
          body: json,
          message: "OK"
      }
    } catch (error) {
      
      return {
          status: 500,
          message: error.message
      }
    }
  }

module.exports = {
    methodGet,
    methodPost
}