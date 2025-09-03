// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

export const getPopularMovies = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/movie/popular');
    const data = await response.json();
    
    if(data.details.results.length > 0) return data.details;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (getPopularMovies) : ${error}`)
    return [];
  }
}

export const searchMovies = async (query, page) => {
  try {
    const response = await fetch(`http://localhost:3000/api/movie/search?query=${query}&page=${page}`);
    const data = await response.json();

    if(data.details.results.length > 0) return data.details;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (searchMovies) : ${error}`)
    return [];
  }
}

export const saveToFavorites = async (props) => {
  try {
    const dataToSend = {
      title : props.title,
      poster_path : props.poster_path,
      release_date : props.release_date,
      imdbID : props.imdbID
    }
    const response = await fetch('http://localhost:3000/api/movie/add/favorites', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(dataToSend)
    });
     
    if(response.ok) return { success : true , status : response.status }; // is response okay when it is 200?
    else return { success : false , status : response.status , error : await response.text()};
  } catch (error) {
    console.log(`Error in saving function FE\nError : ${error}`)
    return { success : false , error : error.message };
  }
}

export const searchFavoriteMovies = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/movie/favorites`);
    const data = await response.json();

    if(data.results.lenght > 0) return data.results;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (searchFavoriteMovies) : ${error}`)
    return [];
  }
}

export const searchSavedMovies = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/movie/saved');
    const data = await response.json();

    if(data.results.lenght > 0) return data.results;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (searchSavedMovies) : ${error}`)
    return [];
  }
}
