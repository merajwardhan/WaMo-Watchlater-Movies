import '../css/MovieCard.css'
import { useState } from 'react';

export default function MovieCard(props){

  function onLike(){
    alert('Clicked Like!!!');
  }

  function onSave(){
    alert('Clicked Save!!!');
  }

  
  // if(props.Poster === 'N/A') props.Poster = 'https://media.istockphoto.com/id/1409329028 should now modify props directly in react
  const GENERIC_POSTER = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='

  const [ imgSrc , SetImgSrc ] = useState(
    props.Poster != 'N/A' ? props.Poster : GENERIC_POSTER
  )

  const handleImageError = () => {
    SetImgSrc(GENERIC_POSTER);
  }

    return <>
        <div className = "movieCard">
          <div className = "moviePoster">
            <img src={imgSrc} alt={props.Title} onError={handleImageError} />
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
            <h3>{props.Title}</h3>
            <p>{props.Year}</p>
          </div>
        </div>
    </>
}