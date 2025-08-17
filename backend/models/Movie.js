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

export const Movie = mongoose.model('Movies', movieSchema );
