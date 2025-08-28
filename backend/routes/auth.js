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
    const user._doc.authToken = authToken;

    return cd(null, user)
})

//router to handle google's callback i.e. the response that google will send
authRouter.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  //code is just a long random string that we recieve back from google that we can exchange for user info (only within 10 mins or so)

  if(!code) return c.json({ msg : `No authentication code recieved!`}, 400);

  try {
    //function that sends token for code
    const tokenResponse = await exchangeCodeForTokens(code)

    //function that returns user information
    const userInfo = await getUserInfo(tokenResponse.access_token)

    const jwtAuthToken = await saveUserGetToken(userInfo); // Create this function that takes user info and saves to mongo and returns the jwt token

    //store info in session
    // const session = await getSession(c);
    // session.set('user', {
    //   id: userInfo.id,
    //   email: userInfo.email,
    //   name: userInfo.name,
    //   picture: userInfo.picture,
    //   provider: 'google'
    // })

    // session.set('accessToken', tokenResponse.access_token)

    // if(tokenResponse.refresh_token) session.set('refreshToken', tokenResponse.refresh_token); //store refresh token if you want to use it.

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
    const userInfo = await User.findOne({ googleId }, { name : 1 }); //Here { name : 1 } is called the projections, where you can decide which values to retrieve and which to not
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
