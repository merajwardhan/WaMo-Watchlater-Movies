// movie related routes
import { Hono } from 'hono';
// import dotenv from 'dotenv';
// dotenv.config(); //Dont have to import dotenv after configuring a the top level (server.js), it is made available as a globally by nodejs, saved into nodejs process.env
import { jwtAuth } from '../middlewares/auth.js'; 
import { getUsersFavoriteMovies, getUsersSavedMovies } from '../utils/databaseUtils.js';

// export const movieRouter = new Hono().basePath('/movie'); This results in the path being : /api/movie/movie/popular
const movieRouter = new Hono();
const BASE_URL = process.env.BASE_URL_TMBD;
const API_KEY = process.env.API_KEY_TMDB;

movieRouter.get('/popular', async (c) => {
  const page = c.req.query('page');
  try {
      const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, {
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${API_KEY}`
        }
      });
  
      const data = await response.json();
  
      if(data.results.length > 0){
          return  c.json({
            details : data
          }, 200);       
      }else{
        console.log(`TMDB Api error : ${data}`);
        return c.json({
          details : []
        }, 404);
      }
  
    } catch (error) {
      console.log(`Error in catch : ${error}`)  
      return c.json({
          details : []
      }, 400);
    }
})

movieRouter.get('/search', async (c) => {
  const query = c.req.query('query');
  const page = c.req.query('page');
  if(!query) return c.json({ msg : `No query found!`}, 402);

  try {
    //Page number should be a state variable or something like that so that we can go to the next page.
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURI(query)}&include_adult=false&language=en-US&page=${page}`, {
      method : 'GET',
      headers : {
        'Content-Type' : 'applicaton/json',
        'Authorization' : `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if(data.results.length > 0){
        return c.json({
          details : data
        }, 200);
    }else{
      console.log(`TMDB Api error : ${data}`);
      return c.json({
        details : []
      });
    }

  } catch (error) {
      return c.json({
        details : []
      }, 200);
    }
})

movieRouter.get('/favorites', jwtAuth , async (c) => {
  try {
    const googleId = c.get('googleId');
    const favMovies = await getUsersFavoriteMovies(googleId);

    return c.json({ results : favMovies }, 200);

  } catch (error) {
    console.log(`Error while fetching the favorites movies in /favorites\nError : ${error}`)
    return c.json({ msg : `something went wrong while fetching favorites`}, 401);
  }
})

movieRouter.post('/add/favorites', jwtAuth , async (c) => {
  try {
    const body = await c.req.json();
    const googleId = c.get('googleId');
    const user = await User.findOne({ googleId });

    if(!user){
      console.log(`User not found`);
      return c.json({ msg : `User not found`}, 404);
    }

    const movie = await Movie.findOneAndUpdate( 
      { imdbID : body.imdbID }, // The query object
      { // This is the update object
        $setOnInsert : { //Only set this fields when upseting (creating the movie document)
          title : body.title,
          imdbID : body.imdbID,
          poster_path : body.poster_path,
          release_date : body.release_date,
        },
        $addToSet : {
          userFavorites : user._id //Adds only if not present
        }
      },
      { //This is the options object
        upsert : true ,
        new : true, // This option should return us the new document
        runValidators : true //forces mongoose to validate the schema before making the updates
       }
    ) 

    await User.findByIdAndUpdate( user._id , {
      $addToSet : { favoriteMovies : movie._id } //Addes only not present
    })

    return c.json({ msg : `Movie saved to favorites`}, 200);

  } catch (error) {
    console.log(`Error while adding movie to favorites\nError : ${error}`);
    return c.json({ msg : `Error while adding movie to favorites`}, 400);
  }
})

export default movieRouter; //made this default export to handle module not found error (tl,dr this did not resolve the error but stil kept the default export)
