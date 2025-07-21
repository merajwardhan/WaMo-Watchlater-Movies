// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

const BASE_URL = import.meta.env.VITE_BASE_URL_TMBD;
const API_KEY = import.meta.env.VITE_API_KEY_TMDB;

export const getPopularMovies = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/movie/popular');
    const data = await response.json();

    if(data.results.length > 0) return data.results;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (getPopularMovies) : ${error}`)
    return [];
  }
}

export const searchMovies = async (query) => {
  try {
    const response = await fetch(`http://localhost:3000/api/movie/search?query=${query}`);
    const data = await response.json();

    if(data.results.length > 0) return data.results;
    else return [];
  } catch (error) {
    console.log(`Network Or Api error in (searchMovies) : ${error}`)
    return [];
  }
}