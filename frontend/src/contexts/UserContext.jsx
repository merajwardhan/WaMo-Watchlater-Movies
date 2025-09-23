import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const authStatus = async function () {
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        credentials : "include", //The frontend doesn't send sensitive info like cookies without us explicitely telling it to do so
      });

      if(response.ok){
        const userData = await response.json();
        setUser(userData);
      }else{
        setUser(null)
      }

    } catch (error) {
      console.log(`Error while fetching user data, Error : ${error}`)
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authStatus();
  }, [] );

  // These are the methods that a provider can provide. This is just for knowledge not for implementation
  // const login = (userData) => {
  //   setUser(userData);
  // }
  //
  // const logout = () => {
  //   //endpoint to clear the jwt
  //   setUser(null);
  // }
  
  const value = { user, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

//Custom hook for easy access to the context
export const useUser = () => {
  return useContext(UserContext);
};
