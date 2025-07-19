// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

const BASE_URL = import.meta.env.VITE_BASE_URL_TMBD;
const API_KEY = import.meta.env.VITE_API_KEY_TMDB;

export const getPopularMovies = async () => {

  try {

    const response = await fetch(`${BASE_URL}/movie/popular`, {
      method : 'GET',
      headers : {
        'Content-Type' : 'applicaton/json',
        'Authorization' : `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if(data.results.length > 0){
        return data.results;       
    }else{
      console.log(`TMDB Api error : ${data}`);
      return [];
    }

  } catch (error) {
    console.log(`Network Or Api error in (getPopularMovies) : ${error}`)
    return [];
  }
}

export const searchMovies = async (query) => {
  try {
    
    //Page number should be a state variable or something like that so that we can go to the next page.
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURI(query)}&include_adult=false&language=en-US&page=1`, {
      method : 'GET',
      headers : {
        'Content-Type' : 'applicaton/json',
        'Authorization' : `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if(data.results.length > 0){
        return data.results;       
    }else{
      console.log(`OMDb Api error : ${data}`);
      return [];
    }

  } catch (error) {
    console.log(`Network Or Api error in (searchMovies) : ${error}`)
    return [];
  }
}