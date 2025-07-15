// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

const BASE_URL = import.meta.env.BASE_URL;

const searchTerm = ['the', 'a' , 'an' , 'of', 'in', 'and', 'man', 'day', 'night', 'love', 'dead', 'last', 'new', 'story', 'life', 'dark', 'sex'];
const randomSearchTerm = searchTerm[Math.floor(Math.random() * searchTerm.length)];
const pageNumber = Math.floor(Math.random() * 100) + 1;

export const getPopularMovies = async () => {

  try {

    console.log(`${BASE_URL}&s=${randomSearchTerm}&page=${pageNumber}`)
    const response = await fetch(`${BASE_URL}&s=${randomSearchTerm}&page=${pageNumber}`);
    const data = await response.json();

    if(data.Response == 'True'){
        return data.Search;       
    }else{
      console.log(`OMDb Api error : ${data.error}`);
      return [];
    }

  } catch (error) {
    console.log(`Network Or Api error in (getPopularMovies) : ${error}`)
    return [];
  }
}

export const searchMovies = async (query) => {
  try {
    
    console.log(`${BASE_URL}&s=${randomSearchTerm}&page=${pageNumber}`)
    const response = await fetch(`${BASE_URL}&s=${encodeURI(query)}`);
    const data = await response.json();

    if(data.Response == 'True'){
        return data.Search;       
    }else{
      console.log(`OMDb Api error : ${data.error}`);
      return [];
    }

  } catch (error) {
    console.log(`Network Or Api error in (searchMovies) : ${error}`)
    return [];
  }
}