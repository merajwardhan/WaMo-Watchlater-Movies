// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

const BASE_URL = import.meta.env.BASE_URL;

const searchTerm = ['the a' , 'of the', 'time', 'end', 'man', 'day', 'night', 'love', 'dead', 'last', 'new', 'story', 'life', 'dark', 'sex'
  , 'age', 'dawn', 'women', 'girl', 'boy', 'love', 'heart', 'family', 'friend', 'light', 'blue', 'red', 'black', 'white', 'story', 'world'
  , 'game', 'road', 'dream', 'truth', 'fall', 'rise', 'killer', 'war', 'battle', 'attack'
];
const randomSearchTerm = searchTerm[Math.floor(Math.random() * searchTerm.length)];
const pageNumber = Math.floor(Math.random() * 100) + 1;

export const getPopularMovies = async () => {

  try {

    console.log(`${BASE_URL}&s=${randomSearchTerm}&page=${pageNumber}`)
    const response = await fetch(`${BASE_URL}&s=${randomSearchTerm}&page=${pageNumber}&type=movie`);
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
    const response = await fetch(`${BASE_URL}&s=${encodeURI(query)}&type=movie`);
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