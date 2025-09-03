import '../css/MovieCard.css'
import { useState } from 'react';
import { toast } from 'react-toastify';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_PATH;

export default function MovieCard(props){

  async function onLike(){
    try {
      const response = await saveToFavorites(props);

      if(response.success) {
        toast.success('Movie saved to favorites!')
      }else{
        if(response.status === 404)  toast.warn(`User not found please login again!`);
        else if(response.status === 400) toast.warn(`Could not add to favorites, Something went wrong!`);
        else toast.error(`Something went wrong!\nError = ${response.error}`);
      }

    } catch (error) {
      console.log(`Error occured while adding movie to favorites!\nError : ${error}`)
      toast.error(`Could not add movie to favorites because of a error!`)
    }
  }

  function onSave(){
    toast.success('Added to saved!!!');
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
              <button className = "favoriteBtn" onClick={onLike}>
                ❤️
              </button>
              <button className = "saveBtn" onClick={onSave}>
                💾
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
