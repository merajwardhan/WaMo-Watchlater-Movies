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
