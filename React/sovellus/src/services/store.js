import axios from "axios";
 
const API_URL = 'https://localhost:44344/api';
 
//Hoidetaan backendiin kutsuminen funktiolla käyttäen axiosta Näitä funktioita kutsutaan frontista ja niille annetaan oikeat tiedot.

const getStorePostsService = async (t) => {
  try {
      return await axios.post(`${API_URL}/store/posts/search`,t);

  } 
  catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

const getProfilePostsService = async (t) => {
  try {
      return await axios.get(`${API_URL}/profile/posts/`+t);
  } 
  catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

export {getStorePostsService, getProfilePostsService}
