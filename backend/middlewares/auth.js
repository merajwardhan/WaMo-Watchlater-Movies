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
