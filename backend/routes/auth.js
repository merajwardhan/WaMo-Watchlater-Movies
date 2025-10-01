import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { exchangeCodeForTokens , getUserInfo } from '../utils/googleUtils.js'
import { User } from '../models/User.js';
import { jwtAuth } from '../middlewares/auth.js';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = 'https://wamo-watchlater-movies.onrender.com/api/auth/google/callback';
const JWT_SECRET = process.env.JWT_SECRET;
const authRouter = new Hono();

const oAuth2Client = new OAuth2Client( GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET , CALLBACK_URL );

authRouter.get('/google' , (c) => {

  const authURL = oAuth2Client.generateAuthUrl({ //This fucntion generated the url for user redirect
    access_type : 'offline',
    scope : [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt : 'consent'
  })

  return c.redirect(authURL);
});


//router to handle google's callback i.e. the response that google will send
authRouter.get('/google/callback', 
  async (c) => {
    try {
      const { code } = c.req.query();

      if(!code){
        return c.json({ msg : `No code found or provided by google`}, 401);
      }

      const { tokens } = await oAuth2Client.getToken(code);
      const idToken = tokens.id_token;

      if(!idToken){
        return c.json({ msg : `No ID Token found`}, 400);
      }

      const ticket = await oAuth2Client.verifyIdToken({ //This is like , jwt.verify()
        idToken, 
        audience: GOOGLE_CLIENT_ID
      });

      const payload =  ticket.getPayload();

      const user = await User.findOneAndUpdate(
        { googleId : payload.sub },
        {
          $set : {
            google : payload.sub,
            name : payload.name,
            email: payload.email,
            picture: payload.picture
          },
        },
        { upsert : true , new : true , setDefaultsOnInsert : true }
      )
      
      const jwtAuthToken = user.authToken();
      
      setCookie(c, 'jwt', jwtAuthToken , {
        httpOnly : true,
        secure : false, //true for production (https)
        sameSite : 'Lax',
        path : '/', // makes the cookie available to all url paths
        maxAge : 60 * 60 * 24 * 365 // 1 year
      })

      return c.redirect('https://wamo.onrender.com/'); // This actually sets the location header

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

    return c.json({ name : userInfo.name }, 200);

  } catch (error) {
    console.log(`Error occured while fetching the user from DB\nError : ${error}`)  
    return c.json({ msg : "Error while fetching userData" }, 401);
  }
})

authRouter.post('/logout', jwtAuth, async (c) => {
  try {
    setCookie(c, 'jwt', '' , {
      httpOnly : true,
      secure : false, //true for production (https)
      sameSite : 'Lax',
      path : '/', // makes the cookie available to all url paths
      expires : new Date(0)
    })

    return c.json({ msg : `Logout successfull!`}, 200);

  } catch (error) {
    console.error(`Something went wrong while logging out`)
    return c.json({ msg : `Could not log out`}, 400);
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
