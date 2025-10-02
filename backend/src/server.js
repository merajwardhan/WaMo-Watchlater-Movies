import 'dotenv/config'; //Import dotenv like this (automatic config) , when you try manual config, (dotenv.config()) it fails to load env variables 
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import movieRouter from '../routes/movies.js';
import authRouter from '../routes/auth.js';
import { cors } from 'hono/cors';
import { jwtAuth } from '../middlewares/auth.js'
const app = new Hono();
import { connectDB } from '../config/database.js';
await connectDB();
const port = process.env.PORT || 3000;

app.use('/api/*', cors({
  origin : process.env.NODE_ENV === 'production'
    ? "https://wamo.onrender.com"
    : "http://localhost:5173",
  allowMethods : ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowHeaders : [`Content-Type`],
  credentials : true,
  // maxAge : 600, //If this option is set then this tells the browser to cache the info regarding complex requests for the next 10 minutes (600 seconds)
}), );  

// app.use('/api/auth/*', jwtAuth); //Closing this middleware routing function and directly routing from the routes itself

app.get('/', (c) => {
  return c.text('Hello from HONO')
}) 

if (movieRouter) {
  app.route('/api/movie', movieRouter);
}else{
  console.log(`movieRouter crashed! , ${movieRouter}`)
}

if (authRouter) {
  app.route('/api/auth', authRouter);
}else{
  console.log(`authRouter crashed , ${authRouter}`)
}


//The connection to the databse should be establised before you start the server
const server = serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Server is running on http://${info.address}:${info.port}`);
});
