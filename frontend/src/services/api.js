// import dotenv from 'dotenv';
// dotenv.config();
// need for backend not frontend

const BASE_URL = process.env.BASE_URL;

const searchTerm = ['the', 'a' , 'an' , 'of', 'in', 'and', 'man', 'day', 'night', 'love', 'dead', 'last', 'new', 'story', 'life', 'dark', 'sex'];
const pageNumber = Math.floor(Math.random() * 100) + 1;

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}?s=${searchTerm}&page=${pageNumber}`);
  const data = await response.json();
  return data.results;
}

export const searchMovies = async (query) => {
  const response = await fetch(`${BASE_URL}?s=${encodeURI(query)}`);
  const data = await response.json();
  return data.results;
}