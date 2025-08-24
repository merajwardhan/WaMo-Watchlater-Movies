import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import { useUser } from '../contexts/UserContext.jsx';

export default function NavBar(){

  const { user, loading } = useUser(); //Destructure the created custom hook

    return <>
    <nav className="navBar">
      <div className='navBarBrand'>
        <Link to='/'>WaMo - Watch Movies Later</Link>
      </div>
      <div className='navBarLinks'>
        <Link to='/' className='navLink'>Home</Link>
        <Link to='/favorites' className='navLink'>Favorites</Link>
        <Link to='/saved' className='navLink'>Saved</Link>
        { loading ? (
          <span className='navLinkUser' >Loading!!!</span>
        ) : ( user ? 
            (
              <span className='navLinkUser' >Welcome , {user.name}</span>
            ) : (
              <a href="http://localhost:3000/api/auth/google" className='navLinkUser'>Login with google</a>
            )
        ) }
      </div>
    </nav>
    </>
}
