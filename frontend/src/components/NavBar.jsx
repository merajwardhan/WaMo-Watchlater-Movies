import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import { useUser } from '../contexts/UserContext.jsx';
import { logUserOut } from '../services/api.js';
import { toast } from 'react-toastify';
export default function NavBar(){

  const { user, setUser, loading } = useUser(); //Destructure the created custom hook

  async function logoutUser(){
    try {
      const loggedOut = await logUserOut(); 

      if(loggedOut){
        toast(`User has been logged out!`)
        setUser(null);
      }
      else toast(`Failed to log you out, try again later or contact the developer!`)

    } catch (error) {
      toast(`Error has occured \nFailed to log you out, try again later or contact the developer!`)
    }
  }

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
              <>
                <span className='navLinkUser'>Welcome , {user.name}</span>
                <button onClick={logoutUser} className='searchButton'>Log out!</button>
              </>
            ) : (
              <a href="http://localhost:3000/api/auth/google" className='navLinkUser'>Login with google</a>
            )
        ) }
      </div>
    </nav>
    </>
}
