import '../css/Favorites.css'
import SavedMovieCard from '../components/SavedMovieCard.jsx';
import { searchFavoriteMovies } from '../services/api.js';
import { useState , useEffect, useRef } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';

export default function Favorites(){

  const [ movies , setMovies ] = useState([]);
  const [ error , setError ] = useState("");
  const [ page , setPage ] = useState(1);
  const [ loading , setLoading ] = useState(true); 
  const [ totalpages , setTotalPages ] = useState(0);
  const prevMoviesLength = useRef(null);

  function handleMovieRemoval(id){
    try {
      setMovies(prevMovies => {
        return prevMovies.filter((movie) => { //another explicit return 
          return movie.id !== id; //explicit return 
        })
      })
    } catch (error) {
      toast.error(`Something went wrong while removing the movie from the local list\nPlease reload the page!`)
    }
  }

  useEffect( () => {
    const currentLength = movies.length;
    const previousLength = prevMoviesLength.current;
    
    if(previousLength === null) {
      prevMoviesLength.current = movies.length;
      return ;
    }

    if(currentLength < previousLength) toast('Movie removed successfully from the favorites!')

    prevMoviesLength.current = movies.length;
  }, [movies])

  useEffect( () => {
    const fetchFavorites = async () => {
      try {

        const favMovies = await searchFavoriteMovies();

        if(favMovies.length > 0) setMovies(favMovies);
        else setError(`Unable to find your favorite movies,\nPlease set your favorite movies!`);

      } catch (error) {
        console.log(`Error while fetching the favorite movies , Error = ${error}`)
        setError(`Failed to load your favorite movies : \nPlease Try again!`);
        setMovies([])
      } finally{
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [] )
  
  if(loading){
    return <>
      <div className = 'favorites'>
        <h2>Loading content please wait with your popcorns!</h2>
        <p>Take a seat, it's entertainment time.</p>
      </div>
    </>
  }

  if(error){
    return <>
      <div className = 'favorites'>
        <h2>Something went wrong while loading the contents!</h2>
        <p>ERROR : {error}</p>
      </div>
    </>
  }

  return (
  <>
    { movies.length > 0 ? ( <>
      <div className='moviesGrid'>
        {movies.map((mov) => (<SavedMovieCard {...mov} key={mov.id} onRemoveSuccess={handleMovieRemoval}/>))}
      </div>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
      />
    </>
    ) : (
      <div className='favorites'>
        <h2>No Favorite movies yet!</h2>
        <p>When you favorite the movies they will be added here!</p>
      </div>
    )}
  </>
)
}
