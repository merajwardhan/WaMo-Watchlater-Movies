export default function MovieCard(props){

  function onLike(){
    alert('Clicked Like!!!');
  }

  function onSave(){
    alert('Clicked Save!!!');
  }

    return <>
        <div className = "movieCard">
          <div className = "moviePoster">
            <img src={props.url} alt={props.title} />
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
            <p>{props.releaseDate}</p>
          </div>
        </div>
    </>
}