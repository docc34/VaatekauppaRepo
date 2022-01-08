import axios from "axios";
 
const API_URL = 'http://localhost:3100';
 
//Hoidetaan backendiin kutsuminen funktiolla käyttäen axiosta Näitä funktioita kutsutaan frontista ja niille annetaan oikeat tiedot.

export const getUserListService = async (id) => {
  try {
    return await axios.get(`${API_URL}/users/getList/`+ id);
  } catch (err) {
    return {
      error: true,
      response: err.response
    };
  }
}

