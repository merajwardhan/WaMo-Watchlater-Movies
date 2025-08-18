import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const { Schema } from mongoose;

const UserSchema = new Schema ({
  googleId : { type : String , unique : true },
  name : String,
  gmail : { type : String , unique : true },
  picture : String,
  favoriteMovies : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Movies'}],
  savedMovies : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Movies'}]
});
//Create 2 collections for saved movies and favorite movies in the database

UserSchema.index({ googleId : 1 }); //indexing logic for finding the user.

export const User = mongoose.model('Users', UserSchema);

// add a clean up function in the backend that check for movies without any users and delete those movies.
