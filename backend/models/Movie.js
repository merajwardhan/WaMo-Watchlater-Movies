import mongoose , { Schema } from 'mongoose';

const movieSchema = new Schema({
  title : String,
  id : { type : Number , unique : true },
  poster_path : String ,
  release_date : String,
  userFavorite : [{ type : mongoose.Schema.Types.ObjectId , ref : 'User'}],
  userSaved : [{ type : mongoose.Schema.Types.ObjectId , ref : 'User'}] //if these two array are empty make a clean up function that deletes the movie from the data base.
})

//movieSchema.index({ _id : 1 }); //To find the movies in the function we would need _id, we have to set ObjectId in the usersTable
//Dont need to create indexing for "_id" as it is already indexed.

export const Movie = mongoose.model('Movie', movieSchema );
