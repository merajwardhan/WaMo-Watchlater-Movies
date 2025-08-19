import { Hono } from 'hono';
import { getSession } from 'hono-session';
import { exchangeCodeForTokens , getUserInfo } from '../utils/googleUtils.js'
// import 'dotenv/config'; //Dont have to import dotenv after configuring a the top level (server.js), it is made available as a globally by nodejs, saved into nodejs process.env
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const authRouter = new Hono();

authRouter.get('/google', (c) => {
  const googleAuthUrl = `https://accounts.google.com/oauth/2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}&` + 
  `redirect_url=http://localhost:3000/api/auth/google/callback&` + 
  `response_type=code&` +
  `scope=email profile&` + 
  `access_type=offline` //access type offline gives you refresh_token

  return c.redirect(googleAuthUrl);//when the user visits this endpoint the user is automatically redirected to the google auth website.
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

    return c.cookie('jwt', jwtAuthToken { //first set the cookie name, then provide the actual cookie then set options 
      httpOnly : true,
      //secure : true,
      path : '/', //cookie is available to all endpoint of our site
      sameSite : 'Lax'
    }).redirect('/') //return to homepage after everything is completed
  } catch (error) {
    console.error( `An error occured while connecting to Goolge auth : ${error}`);
    return c.json({ 
      msg : `Authentiction failed!`,
      error,
    }, 500);
  }
}) 

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
