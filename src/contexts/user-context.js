import React, { useEffect, useState } from 'react';
import { getUserProfileFromJWT } from '../clients/auth.js';

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
    })();
  }, []);
  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
