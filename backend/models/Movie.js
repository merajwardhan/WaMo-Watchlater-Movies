import mongoose from 'mongoose';
const { Schema } from mongoose;

const movieSchema = new Schema({
  title : String,
  imdbID : { type : Number , unique : true },
  poster_path : String ,
  release_date : String,
  usersFavorite : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Users'}],
  usersSaved : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Users'}] //if these two array are empty make a clean up function that deletes the movie from the data base.
})

//movieSchema.index({ _id : 1 }); //To find the movies in the function we would need _id, we have to set ObjectId in the usersTable
//Dont need to create indexing for "_id" as it is already indexed.

export const Movie = mongoose.model('Movies', movieSchema );
