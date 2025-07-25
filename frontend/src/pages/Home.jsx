import MovieCard from "../components/MovieCard";
import { useState , useEffect } from 'react';
import '../css/Home.css';
import { getPopularMovies , searchMovies } from "../services/api";

export default function Home(){

  const [ searchQuery , setSearchQuery ] = useState("");
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

        const fetchedMovies = await getPopularMovies(); 

        if(fetchedMovies.results.length > 0) {
          setMovies(fetchedMovies.results);
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

  }, [] )

  const handleSearch = async (event) => {
    event.preventDefault();//This prevents the default behaviour (clearing the input box)

    const query = searchQuery.trim();
    setPage(1); //Change page to 1 for a new search

    if(!query) {
      setError(`Error while conducting the search, Please check the input and try again!`)
      searchMovies([]);
      return
    }

    async function fetchMovies(){
      try {
          const fetchedMovies = await searchMovies(query, page);  

            setLoading(true);
            setError(null);
          
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
          console.log(`Error occurred while searching for the movie : ${error}`);
          setError(`Failed to load Movies, Please try again later..`)
          setMovies([])
        }finally{
          setLoading(false);
        }
      }
    
    fetchMovies();
  }

  useEffect( () => {
    async function pageChange() {
      try {
        const fetchedMovies = await searchMovies(searchQuery, page);  

        setLoading(true);
        setError(null);
      
        if(fetchedMovies.results.length > 0) {
          setMovies(fetchedMovies.results);
          if(fetchedMovies.total_pages) setTotalPages(fetchedMovies.total_pages)
        }else{
          setMovies([{
            Title : 'Failed to fetch Movies',
            Poster : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
            Year : 'Sorry Dude, No info!'
          },{
            Title : 'Failed to fetch Movies',
            Poster : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
            Year : 'Sorry Dude, No info!'
          },{
            Title : 'Failed to fetch Movies',
            Poster : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
            Year : 'Sorry Dude, No info!'
          }]);
        } 
              
      } catch (error) {
        console.log(`Error occurred while searching for the movie : ${error}`);
        setError(`Failed to load Movies, Please try again later..`)
        setMovies([])
      }finally{
        setLoading(false);
      }
    }

    if(page > 1) pageChange()

  }, [page])

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