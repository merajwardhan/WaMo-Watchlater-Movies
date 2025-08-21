import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const authStatus = async function () {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

    } catch (error) {
      console.log(`Error while fetching user data, Error : ${error}`)
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
}
