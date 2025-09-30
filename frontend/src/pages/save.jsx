import '../css/save.css'
import SavedMovieCard from '../components/SavedMovieCard.jsx';
import { searchSavedMovies } from '../services/api.js';
import { useState , useEffect, useRef } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';

export default function Saved(){

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

    if(currentLength < previousLength) toast('Movie removed successfully from the saved!')

    prevMoviesLength.current = movies.length;
  }, [movies])

  useEffect( () => {
    const fetchSaved = async () => {
      try {

        const savedMovies = await searchSavedMovies();

        if(savedMovies.length > 0) setMovies(savedMovies);
        else setError(`Unable to find your saved movies,\nPlease set your saved movies!`);

      } catch (error) {
        console.log(`Error while fetching the saved movies , Error = ${error}`)
        setError(`Failed to load your saved movies : \nPlease Try again!`);
        setMovies([])
      } finally{
        setLoading(false);
      }
    }

    fetchSaved();
  }, [] )
  
  if(loading){
    return <>
      <div className = 'saved'>
        <h2>Loading content please wait with your popcorns!</h2>
        <p>Take a seat, it's entertainment time.</p>
      </div>
    </>
  }

  if(error){
    return <>
      <div className = 'saved'>
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
    <div className ='saved'>
      <h2>There are no saved movies yet!</h2>
      <p>Saved movies will appear here.</p>
    </div>
    )}
  </>
  )
}
