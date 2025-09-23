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

app.use('/api/*', cors({
  origin : "http://localhost:5173/",
  allowMethos : ['GET', 'POST', 'OPTIONS'],
  allowHeaders : [`Content-Type`],
  credentials : True,
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
  port: 3000
}, (info) => {
  console.log(`Server is running on http://${info.address}:${info.port}`);
});

// TODO: Add the middlewares here , also uncomment the database connection code.

// serve(app); //default server is 3000 
// serve( app , { port : 8000 }) this will change the default server

// import express from 'express';
// const app = express();

// app.get('/', (req,res) => {
//   res.send(`Express running totally fine!`);
// })

// app.listen ( 3000 , console.log(`Server running on port 3000!`));
