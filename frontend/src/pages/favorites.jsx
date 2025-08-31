import '../css/Favorites.css'
import MovieCard from '../components/MovieCard.jsx';
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
      
    } catch (error) {
      console.log(`Error while fetching the favorite movies , Error = ${error}`)
      setError(`Failed to load your favorite movies : ( \nPlease Try again!`);
      setMovies([])
    } finally{
      setLoading(false);
    }
  }, [] )

  return <>
    
  </>
}


    {/* <div className = 'favorites'> */}
    {/*   <h2>No Favorite movies yet!</h2> */}
    {/*   <p>When you favorite the movies they will be added here!</p> */}
    {/* </div> */}
