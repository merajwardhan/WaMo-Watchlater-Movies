// movie related routes
import { Hono } from 'hono';
// import dotenv from 'dotenv';
// dotenv.config(); //Dont have to import dotenv after configuring a the top level (server.js), it is made available as a globally by nodejs, saved into nodejs process.env

// export const movieRouter = new Hono().basePath('/movie'); This results in the path being : /api/movie/movie/popular
const movieRouter = new Hono();
const BASE_URL = process.env.BASE_URL_TMBD;
const API_KEY = process.env.API_KEY_TMDB;

movieRouter.get('/popular', async (c) => {
  try {
      const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, {
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${API_KEY}`
        }
      });
  
      const data = await response.json();
  
      if(data.results.length > 0){
          return  c.json({
            details : data
          }, 200);       
      }else{
        console.log(`TMDB Api error : ${data}`);
        return c.json({
          details : []
        }, 404);
      }
  
    } catch (error) {
      console.log(`Error in catch : ${error}`)  
      return c.json({
          details : []
      }, 400);
    }
})

movieRouter.get('/search', async (c) => {
  const query = c.req.query('query');
  const page = c.req.query('page');
  if(!query) return c.json({ msg : `No query found!`}, 402);

  try {
    //Page number should be a state variable or something like that so that we can go to the next page.
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURI(query)}&include_adult=false&language=en-US&page=${page}`, {
      method : 'GET',
      headers : {
        'Content-Type' : 'applicaton/json',
        'Authorization' : `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    if(data.results.length > 0){
        return c.json({
          details : data
        }, 200);
    }else{
      console.log(`TMDB Api error : ${data}`);
      return c.json({
        details : []
      });
    }

  } catch (error) {
      return c.json({
        details : []
      }, 200);
    }
})

export default movieRouter; //made this default export to handle module not found error (tl,dr this did not resolve the error but stil kept the default export)
