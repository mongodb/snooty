import React, { useEffect, useState } from 'react';
import { getUserProfileFromJWT } from '../services/auth.js';
import { useLocation } from '@reach/router';
// import { isBrowser } from '../utils/is-browser';

const defaultContextValue = {
  isFetching: false,
  user: null,
};

const UserContext = React.createContext(defaultContextValue);

const UserProvider = ({ children = {} }) => {
  const [userData, setUserData] = useState();

  const location = useLocation();

  useEffect(() => {
    (async () => {
      const userProfile = await getUserProfileFromJWT();
      setUserData(userProfile);
      console.log(userProfile);
    })();
  }, [location]);
  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
