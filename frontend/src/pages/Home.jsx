import MovieCard from "../components/MovieCard";
import { useState , useEffect } from 'react';
import '../css/Home.css';
import { getPopularMovies , searchMovies } from "../services/api";
import { ToastContainer, Bounce } from 'react-toastify';

export default function Home(){

  const [ searchQuery , setSearchQuery ] = useState("");
  const [ activeQuery , setActiveQuery ] = useState("");
  const [ movies , setMovies ] = useState([]);
  const [ loading , setLoading ] = useState(true);
  const [ error , setError ] = useState(null);
  const [ page , setPage ] = useState(1);
  const [ totalPages , setTotalPages ] = useState(0);

  useEffect( () => {

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedMovies;

        if(activeQuery){
           fetchedMovies = await searchMovies(searchQuery, page);
        }else{
           fetchedMovies = await getPopularMovies(page); 
        }

        if(fetchedMovies.results.length > 0) {
          setMovies(fetchedMovies.results);
          if(fetchedMovies.total_pages) setTotalPages(fetchedMovies.total_pages)
        }else{
          setMovies([{
            Title : 'Failed to fetch Movies',
            Poster : 'https://w0.peakpx.com/wallpaper/27/386/HD-wallpaper-naruto-anime-error-skyline.jpg',
            Year : 'Sorry Dude, No info!'
          },{
            Title : 'Failed to fetch Movies',
            Poster : 'https://w0.peakpx.com/wallpaper/27/386/HD-wallpaper-naruto-anime-error-skyline.jpg',
            Year : 'Sorry Dude, No info!'
          },{
            Title : 'Failed to fetch Movies',
            Poster : 'https://w0.peakpx.com/wallpaper/27/386/HD-wallpaper-naruto-anime-error-skyline.jpg',
            Year : 'Sorry Dude, No info!'
          }]);
        }

      } catch (error) {
        console.log(`Error occurred while fetching movies : ${error}`);
        setError('Failed to load Movies, Please try again later..');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    } 

    
    fetchMovies();  

  }, [ activeQuery , page ] )

  const handleSearch = async (event) => {
    event.preventDefault();//This prevents the default behaviour (clearing the input box)

    setActiveQuery(searchQuery.trim());
    setPage(1); //Change page to 1 for a new search

  }

  const goToPrevious = () => {
    if(page > 1) setPage(page - 1);
  }

  const goToNext = () => {
    if(page < totalPages) setPage(page + 1)
  }

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

  return <>
  <div className = "home">

    <form onSubmit={handleSearch} className = 'searchForm'>
      <input
       type='text'
       placeholder='Search for movies...' 
       className='searchInput'
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type='submit' className='searchButton'>Search</button>
    </form>

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

    <div className = "moviesGrid">
      {movies.map((mov) => (<MovieCard {...mov} key={mov.id}/>))} 
    </div>
  </div>
  <div className="pagination">
    <button onClick={goToPrevious} disabled={page === 1} className="pageButton">
      Previous Page
    </button>
    <button onClick={goToNext} disabled={page === totalPages} className="pageButton">
      Next Page
    </button>
  </div>
  </>
}//sending individual movies(mov) as props

//Conditional rendering of the movies with the static array that we created
// => {movies.map((mov) => (mov.title.toLowerCase().startsWith(searchQuery) &&
      //  <MovieCard {...mov} key={mov.id}/>))} 
