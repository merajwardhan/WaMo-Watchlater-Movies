import '../css/Favorites.css'
import SavedMovieCard from '../components/SavedMovieCard.jsx';
import { searchFavoriteMovies } from '../services/api.js';
import { useState , useEffect } from 'react';

export default function Favorites(){

  const [ movies , setMovies ] = useState([]);
  const [ error , setError ] = useState("");
  const [ page , setPage ] = useState(1);
  const [ loading , setLoading ] = useState(true); 
  const [ totalpages , setTotalPages ] = useState(0);

  useEffect( () => {
    try {
      
      const favMovies = await searchFavoriteMovies();

      if(favMovies.length > 0) setMovies(favMovies);
      else setError(`Unable to find your favorite movies,\nPlease set your favorite movies!`);
      
    } catch (error) {
      console.log(`Error while fetching the favorite movies , Error = ${error}`)
      setError(`Failed to load your favorite movies : ( \nPlease Try again!`);
      setMovies([])
    } finally{
      setLoading(false);
    }
  }, [] )

  return <>
    { movies.length > 1 ? 
    <div className='moviesGrid'>
      {movies.map((mov) => (<SavedMovieCard {..mov} key={mov.imdbID}/>))}
    </div>} : 
    <div className="favorites">
      <h2>No Favorite movies yet!</h2>
      <p>When you favorite the movies they will be added here!</p>
    </div>
  </>
}
