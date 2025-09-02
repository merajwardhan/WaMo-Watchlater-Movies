import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const { Schema } = mongoose; // Destructure the Schema from the mongoose object;

const UserSchema = new Schema ({
  googleId : { type : String , unique : true },
  name : String,
  gmail : { type : String , unique : true },
  picture : String,
  favoriteMovies : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Movies'}],
  savedMovies : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Movies'}]
});
//Create 2 collections for saved movies and favorite movies in the database

// UserSchema.index({ googleId : 1 }); //This is schmema level indexing just for proactice.indexing logic for finding the user.
// The indexing is commented out because setting the value to be unique automatically creates a index on the value.

UserSchema.methods.authToken = function(){
  return jwt.sign({ googleId : this.googleId }, JWT_SECRET) // This is synchoronous because it does not have a CB function
}

export const User = mongoose.model('Users', UserSchema);

// add a clean up function in the backend that check for movies without any users and delete those movies.
