import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
const JWT_SECRET = process.env.JWT_SECRET;

export const jwtAuth = async function (c, next) {
  try {
    const token = getCookie(c, 'jwt');
    if(!token) return c.json({ msg : `No token provided`} , 401 );

    const payload = jwt.verify(token, JWT_SECRET);
    c.set('googleId', payload.googleId);

    await next();

    } catch (error) {
      console.log(`Error while verifying the jwt token\nError : ${error}`) 
      return c.json({ msg : `Error occured, could not verify the JWT`} , 401 )
    }  
}

// THIS IS THE PREVIOUS SESSION MANAGEMENT CODE WHICH IS TO BE REPLACED WITH JWT AUTH FOR SERVERLESS SUPPORT

// import 'dotenv/config';
// import { session } from 'hono-session';
//
// const SESSION_SECRET =  process.env.SESSION_SECRET;
//
// export const manageSession = sessionMiddleware({
//   secret : SESSION_SECRET, //This is for decrypting the session cookie
//   cookieOptions : {
//     httpOnly: true, 
//     secure : false, //true for production, allows request only from HTTPS
//     sameSite: 'lax',
//     maxAge: 24 * 60 * 60
//   }
// })
