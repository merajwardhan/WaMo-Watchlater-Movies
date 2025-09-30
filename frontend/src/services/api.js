const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://wamo-watchlater-movies.onrender.com'
  : 'http://localhost:3000';

export const getPopularMovies = async (page) => {
  try {
    const response = await fetch(`${API_URL}/api/movie/popular?page=${page}`);
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
    const response = await fetch(`${API_URL}/api/movie/search?query=${query}&page=${page}`);
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
    const response = await fetch(`${API_URL}/api/movie/add/favorites`, {
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

export const saveToSaved = async (details) => {
  try {
    const dataToSend = {
      title : details.title,
      poster_path : details.poster_path,
      release_date : details.release_date,
      id : details.id
    }
    const response = await fetch(`${API_URL}/api/movie/add/saved`, {
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
    const response = await fetch(`${API_URL}/api/movie/favorites`, {
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
    const response = await fetch(`${API_URL}/api/movie/saved`, {
      credentials : 'include',
    });
    const data = await response.json();

    if(data.results.length > 0) return data.results;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (searchSavedMovies) : ${error}`)
    return [];
  }
}

export const removeFavoriteMovie = async(details) => {
  try {
    const response = await fetch(`${API_URL}/api/movie/remove/favorites`, {
      method : 'DELETE', 
      credentials : 'include',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        id : details.id
      }),
    })

    if(response.ok) return true;
    else return false;

  } catch (error) {
    console.log(`An error occured while removing the movie\nError : ${error}`)
    return false;
  }
}

export const removeSavedMovie = async(details) => {
  try {
    const response = await fetch(`${API_URL}/api/movie/remove/saved`, {
      method : 'DELETE', 
      credentials : 'include',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        id : details.id
      }),
    })

    if(response.ok) return true;
    else return false;

  } catch (error) {
    console.log(`An error occured while removing the movie\nError : ${error}`)
    return false;
  }
}

export const logUserOut = async() => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method : 'POST',
      credentials : 'include'
    })

    if(response.ok) return true;
    else return false;

  } catch (error) {
    console.error(`Something went wrong while deleting the user, in FE\nError : ${error}`)   
    return false;
  }
}
