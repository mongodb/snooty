import React, { useEffect, useState } from 'react';
import { getUserProfileFromJWT } from '../clients/auth.js';
// import { isBrowser } from '../utils/is-browser';

const defaultContextValue = {
  isFetching: false,
  user: null,
};

const UserContext = React.createContext(defaultContextValue);

const UserProvider = ({ children = {} }) => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    (async () => {
      const userProfile = await getUserProfileFromJWT();
      setUserData(userProfile);
      console.log(userProfile);
    })();
  }, []);
  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
