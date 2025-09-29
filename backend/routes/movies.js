// movie related routes
import { Hono } from 'hono';
// import dotenv from 'dotenv';
// dotenv.config(); //Dont have to import dotenv after configuring a the top level (server.js), it is made available as a globally by nodejs, saved into nodejs process.env
import { jwtAuth } from '../middlewares/auth.js'; 
import { getUsersFavoriteMovies, getUsersSavedMovies } from '../utils/databaseUtils.js';
import { Movie } from '../models/Movie.js';
import { User } from '../models/User.js';

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
      { id : body.id }, // The query object
      { // This is the update object
        $setOnInsert : { //Only set this fields when upserting (creating the movie document)
          title : body.title,
          id : body.id,
          poster_path : body.poster_path,
          release_date : body.release_date,
        },
        $addToSet : {
          userFavorite : user._id //Adds only if not present
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

movieRouter.delete('/remove/favorites', jwtAuth , async (c) => {
  const body = await c.req.json();
  const googleId = c.get('googleId');

  try {
    const user = await User.findOne({ googleId }).select('_id favoriteMovies');
    if(!user) return c.json({msg : `Unable to find the given user!`}, 400);

    const movie = await Movie.findOne({ id : body.id }).select('_id userFavorite');
    if(!movie) console.warn(`Movie not present , or not found!`);


    if(movie){

      await User.findByIdAndUpdate(user._id , {
        $pull : {
          favoriteMovies : movie._id
        }
      }) //delete the movie from the user's array only if the movie document is present

      const updatedMovie = await Movie.findByIdAndUpdate(
        movie._id, 
        {
          $pull: {
            userFavorite : user._id
          },
        },
        { new : true },
      )

      if(updatedMovie.userFavorite.length === 0) await Movie.deleteOne({ _id : updatedMovie._id }); //deletes the movie document if no user has that movie as their favorite
    } 

    return c.json({ success : true , msg : `Movie removed successfully from favorites!`}, 200);

  } catch (error) {
    console.error(`An error occured while deleting the movie from favorites!\nError : ${error}`)
    return c.json({ msg : `Could not delete the movie from favorites`}, 400);
  }
})

movieRouter.get('/saved', jwtAuth , async (c) => {
  try {
    const googleId = c.get('googleId');
    const savedMovies = await getUsersSavedMovies(googleId);

    return c.json({ results : savedMovies }, 200);

  } catch (error) {
    console.log(`Error while fetching the saved movies in /saved\nError : ${error}`)
    return c.json({ msg : `something went wrong while fetching saved`}, 401);
  }
})

movieRouter.post('/add/saved', jwtAuth , async (c) => {
  try {
    const body = await c.req.json();
    const googleId = c.get('googleId');
    const user = await User.findOne({ googleId });

    if(!user){
      console.log(`User not found`);
      return c.json({ msg : `User not found`}, 404);
    }

    const movie = await Movie.findOneAndUpdate( 
      { id : body.id }, // The query object
      { // This is the update object
        $setOnInsert : { //Only set this fields when upserting (creating the movie document)
          title : body.title,
          id : body.id,
          poster_path : body.poster_path,
          release_date : body.release_date,
        },
        $addToSet : {
          userSaved : user._id //Adds only if not present
        }
      },
      { //This is the options object
        upsert : true ,
        new : true, // This option should return us the new document
        runValidators : true //forces mongoose to validate the schema before making the updates
      }
    ) 

    await User.findByIdAndUpdate( user._id , {
      $addToSet : { savedMovies : movie._id } //Addes only not present
    })

    return c.json({ msg : `Movie saved to saved`}, 200);

  } catch (error) {
    console.log(`Error while adding movie to saved\nError : ${error}`);
    return c.json({ msg : `Error while adding movie to saved`}, 400);
  }
})

movieRouter.delete('/remove/saved', jwtAuth , async (c) => {
  const body = await c.req.json();
  const googleId = c.get('googleId');

  try {
    const user = await User.findOne({ googleId }).select('_id savedMovies');
    if(!user) return c.json({msg : `Unable to find the given user!`}, 400);

    const movie = await Movie.findOne({ id : body.id }).select('_id userSaved');
    if(!movie) console.warn(`Movie not present , or not found!`);

    if(movie){

      await User.findByIdAndUpdate(user._id , {
        $pull : {
          savedMovies : movie._id
        }
      }) //delete the movie from the user's array only if the movie document is present

      const updatedMovie = await Movie.findByIdAndUpdate(
        movie._id, 
        {
          $pull: {
            userSaved : user._id
          },
        },
        { new : true },
      )

      if(updatedMovie.userSaved.length === 0) await Movie.deleteOne({ _id : updatedMovie._id }); //deletes the movie document if no user has that movie as their favorite
    } 

    return c.json({ success : true , msg : `Movie removed successfully from saved!`}, 200);

  } catch (error) {
    console.error(`An error occured while deleting the movie from saved!\nError : ${error}`)
    return c.json({ msg : `Could not delete the movie from saved`}, 400);
  }
})

export default movieRouter; //made this default export to handle module not found error (tl,dr this did not resolve the error but stil kept the default export)
