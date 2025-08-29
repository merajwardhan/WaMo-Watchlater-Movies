import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { exchangeCodeForTokens , getUserInfo } from '../utils/googleUtils.js'
import { User } from '../models/User.js';
import { jwtAuth } from '../middlewares/auth.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-auth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const authRouter = new Hono();

passport.use(new GoogleStrategy({
  clientID : GOOGLE_CLIENT_SECRET,
  clientSecret : GOOGLE_CLIENT_SECRET,
  callbackURL : 'http://localhost:3000/api/auth/google/callback'
}, function(accessToken, refreshToken, profile, cb){
    
    const user = User.findOneAndUpdate( 
      { googleid : profile.id},
      { $set : {
        googleId : profile.id,
        name : profile.name,
        email : profile.email,
        picture : profile.picture
      }},
      {
        upsert : true ,//create if doesn't exist
        new : true, // Return the new document
        setDefaultsOnInsert : true  // Add default fields
      }
    )    
    const authToken = user.methods.authToken(); //Add jwt creation logic here and then return the token.
    // user._doc.authToken = authToken;
    user.authToken = authToken;

    return cd(null, user)
})

authRouter.get('/google' , 
  passport.authenticate('google', { scope : ['profile' , 'email']});

//router to handle google's callback i.e. the response that google will send
authRouter.get('/google/callback', 
  passport.authenticate('google' , { failureRedirect : '/api/movie/popular'}) ,
  async (c) => {
    try {

      const jwtAuthToken = c.user.authToken;
      
      setCookie(c, 'jwt', jwtAuthToken , {
        httpOnly : true,
        secure : false, //true for production (https)
        sameSite : 'Lax',
        path : '/', // makes the cookie available to all url paths
        maxAge : 60 * 60 * 24 * 365 // 1 year
      })

      return c.redirect('/api/movie/popular'); // This actually sets the location header

    } catch (error) {
      console.error( `An error occured while connecting to Goolge auth : ${error}`);
      return c.json({ 
        msg : `Authentiction failed!`,
        error,
      }, 500);
    }
}) 

authRouter.get('/me', jwtAuth , async (c) => {
  const googleId = c.get('googleId');
  try {
    const userInfo = await User.findOne({ googleId }, { name : 1 , _id : 0 }); //Here { name : 1 } is called the projections, where you can decide which values to retrieve and which to not
    // { valueName : 1 , value2Name : 1 } here 1 means retrieve the value and zero means don't retrieve that value
    
    if(!userInfo){ return c.json({ msg : "Could not retrieve user Information" }, 401 )};

    return c.json({ name : userInfo.name })

  } catch (error) {
    console.log(`Error occured while fetching the user from DB\nError : ${error}`)  
    return c.json({ msg : "Error while fetching userData" }, 401);
  }
})

export default authRouter;

// Logout logic for session 
//
// authRouter.get(`/logout`, async (c) => {
//   const session = getSession(c);
//   session.delete('user');
//   session.delete('accessToken');
//   session.delete('refreshToken');
//
//   return c.redirect('/');
// })
