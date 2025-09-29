// This is where all the data base code will be 
import { User } from '../models/User.js';
import { Movie } from '../models/Movie.js';

export async function getUsersFavoriteMovies(googleId){
  try {
    const foundMovies = await User.aggregate([
        { $match : { googleId }},
        {
          $lookup : {
            from : 'movies',
            localField : 'favoriteMovies',
            foreignField : '_id',
            as : 'moviesDetails'
          }
        },
        {
          $project : {
            _id : 0, // By default the _id field is kept, so excludes that
            moviesDetails : 1 //Just include the moviesDetails in the result
          }
        }
    ]); 

      return foundMovies.length > 0 ? foundMovies[0].moviesDetails : []; //This will return the whole user document with the new field which has the movies array

    } catch (error) {
      console.log(`Error while retrieving favorite movies!\nError : ${error}`)
      return [];
    }
  }

export async function getUsersSavedMovies(googleId){

  try {
    const foundMovies = await User.aggregate([
        { $match : { googleId }},
        {
          $lookup : {
            from : 'movies',
            localField : 'savedMovies',
            foreignField : '_id',
            as : 'moviesDetails'
          }
        },
        {
          $project : {
            _id : 0, 
            moviesDetails : 1
          }
        }
      ]); 

      return foundMovies.length > 0 ? foundMovies.moviesDetails[0] : []; //This will return the whole user document with the new field which has the movies array

    } catch (error) {
      console.log(`Error while retrieving saved movies!\nError : ${error}`)
      return [];
    }
}

