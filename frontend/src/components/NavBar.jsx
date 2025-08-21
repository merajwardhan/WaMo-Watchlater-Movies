import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

export default function NavBar(){

  const [ user , setUser ] = useState(null);

    return <>
    <nav className="navBar">
      <div className='navBarBrand'>
        <Link to='/'>WaMo - Watch Movies Later</Link>
      </div>
      <div className='navBarLinks'>
        <Link to='/' className='navLink'>Home</Link>
        <Link to='/favorites' className='navLink'>Favorites</Link>
        <Link to='/saved' className='navLink'>Saved</Link>
        { user ? (
          <span className='navLinkUser' >Welcome , {user.name}</span>
        ) : (
          <a href="/auth/google" className='navLinkUser'>Login with google</a>
        )}
      </div>
    </nav>
    </>
}
