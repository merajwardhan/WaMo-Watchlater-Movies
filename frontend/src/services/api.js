// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

export const getPopularMovies = async (page) => {
  try {
    const response = await fetch(`http://localhost:3000/api/movie/popular?page=${page}`);
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

export const saveToFavorites = async (details) => {
  try {
    const dataToSend = {
      title : details.title,
      poster_path : details.poster_path,
      release_date : details.release_date,
      id : details.id
    }
    const response = await fetch('http://localhost:3000/api/movie/add/favorites', {
      method : 'POST',
      credentials : 'include',
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
    const response = await fetch(`http://localhost:3000/api/movie/favorites`, {
      credentials : 'include',
    });
    const data = await response.json();

    if(data.results.length > 0) return data.results;
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

export const removeFavoriteMovie = async(details) => {
  try {
    const response = await fetch('http://localhost:3000/api/movie/remove/favorites', {
      method : 'DELETE', 
      credentials : 'include',
      body : {
        id : details.id
      }
    })

    const data = await response.json();
    if(response.ok) return true;
    else return false;

  } catch (error) {
    console.log(`An error occured while removing the movie\nError : ${error}`)
    return false;
  }
}
