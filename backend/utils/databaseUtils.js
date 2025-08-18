// This is where all the data base code will be 


export async function getUsersFavoriteMovies(googleId){
  try {
    const foundMovies = await User.aggregate({
        { $match : { googleId }},
        {
          $lookup : {
            from : 'Movies',
            localField : 'favoriteMovies',
            foreighField : '_id',
            as : 'moviesDetails'
          }
        }
      }).toArray(); // Returns the movies in from of array in the 'moviesDetails' field     

      return foundMovies; //This will return the whole user document with the new field which has the movies array

    } catch (error) {
      console.log(`Error while retrieving favorite movies!\nError : ${error}`)
      return [];
    }
  }

  export async function getUsersSavedMovies(googleId){

    try {
      const foundMovies = await User.aggregate({
          { $match : { googleId }},
          {
            $lookup : {
              from : 'Movies',
              localField : 'savedMovies',
              foreighField : '_id',
              as : 'moviesDetails'
            }
          }
        }).toArray(); // Returns the movies in from of array in the 'favoriteMoviesDetails' field     

        return foundMovies; //This will return the whole user document with the new field which has the movies array

      } catch (error) {
        console.log(`Error while retrieving favorite movies!\nError : ${error}`)
        return [];
      }
}
