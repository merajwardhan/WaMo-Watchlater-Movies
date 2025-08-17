import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const { Schema } from mongoose;

const UserSchema = new Schema ({
  googleId : { type : String , unique : true },
  name : String,
  gmail : { type : String , unique : true },
  picture : String,
  favoriteMovies : [],
  savedMovies : []//check how to fill these arrays with movie documents.
});//basic user schema defined , make changes later . Add a ref to the movies , in such a way that you don't have to look up all the movies for a specific user.
//Create 2 collections for saved movies and favorite movies 

UserSchema.index({ googleId : 1 }); //indexing logic for finding the user.

export const User = mongoose.model('Users', UserSchema);

// add a clean up function in the backend that check for movies without any users and delete those movies.
