import mongoose from 'mongoose';
const { Schema } from mongoose;

const movieSchema = new Schema({
  title : String,
  imdbID : { type : Number , unique : true },
  poster : String ,
  release_date : String,
  usersFavorite : [],
  usersSaved : [] //if these two array are empty make a clean up function that deletes the movie from the data base.
})

movieSchema.index({ _id : 1 }); //To find the movies in the function we would need _id, we have to set ObjectId in the usersTable

export const Movie = mongoose.model('Movies', movieSchema );
