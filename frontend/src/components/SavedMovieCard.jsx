import '../css/MovieCard.css'
import { useState } from 'react';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_PATH;
import { removeFavoriteMovie } from '../services/api.js';
import { toast } from 'react-toastify';

export default function MovieCard(props){

  async function onRemove(details){
    try {
      const movieDeleted = await removeFavoriteMovie(details); 
      if(movieDeleted) //page reload with new list logic
      else toast.warn('Could not delete the movie , please try again later or contact the developer!')
    } catch (error) {
      toast.error(`Something went wrong while removing the movie\nError : ${error}`)
    }
  }
  
  // if(props.Poster === 'N/A') props.Poster = 'https://media.istockphoto.com/id/1409329028 should now modify props directly in react
  const GENERIC_POSTER = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='

  const [ imgSrc , SetImgSrc ] = useState(
    props.poster_path ? `${IMAGE_BASE_URL}${props.poster_path}` : GENERIC_POSTER
  )

  const handleImageError = () => {
    if(!props.poster_path) SetImgSrc(GENERIC_POSTER);
  }

    return <>
        <div className = "movieCard">
          <div className = "moviePoster">
            <img src={imgSrc} alt={props.title} onError={handleImageError} />
            <div className = "movieOverlay">
              <button className = "crossBtn" onClick={() => onRemove(props)}>
                ❌
              </button>
            </div>
          </div>
          <div>
            <h3>{props.title}</h3>
            <p>{props.release_date}</p>
          </div>
        </div>
    </>
}
