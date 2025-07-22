import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { movieRouter } from '../routes/movies';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/api/*', cors({
  origin: (origin) => origin === 'http://localhost:5173' ? origin : '*'
}));

app.get('/', (c) => {
  return c.text('Hello from HONO')
}) 

app.route('/api/movie', movieRouter);

const server = serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://${info.address}:${info.port}`);
});


// serve(app); //default server is 3000 
// serve( app , { port : 8000 }) this will change the default server

// import express from 'express';
// const app = express();

// app.get('/', (req,res) => {
//   res.send(`Express running totally fine!`);
// })

// app.listen ( 3000 , console.log(`Server running on port 3000!`));