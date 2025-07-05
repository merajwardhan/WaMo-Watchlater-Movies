import { Link } from 'react-router-dom';
import '../css/NavBar.css';

export default function NavBar(){
    return <>
    <nav className="navBar">
      <div className='navBarBrand'>
        <Link to='/'>Movie App</Link>
      </div>
      <div className='navBarLinks'>
        <Link to='/' className='navLink'>Home</Link>
        <Link to='/favorites' className='navLink'>Favorites</Link>
        <Link to='/saved' className='navLink'>Saved</Link>
      </div>
    </nav>
    </>
}