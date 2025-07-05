import MovieCard from "../components/MovieCard";
import { useState } from 'react';
import '../css/Home.css';

export default function Home(){

  const [ searchQuery , setSearchQuery ] = useState("");

  const movies = [
    {id : 1 , title : 'John Wick', releaseDate : '2018'},
    {id : 2 , title : 'Terminator', releaseDate : '1999'},
    {id : 3 , title : 'Cars 3', releaseDate : '2015'},
  ]

  const handleSearch = (e) => {
    e.preventDefault();//This prevents the default behaviour (clearing the input box)
    alert(searchQuery);
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
  </>
}//sending individual movies(mov) as props

//Conditional rendering of the movies with the static array that we created
// => {movies.map((mov) => (mov.title.toLowerCase().startsWith(searchQuery) &&
      //  <MovieCard {...mov} key={mov.id}/>))} 