import React, { createContext, useContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { CLIENT_ID, SCOPES } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function initClient() {
      gapi.client.init({
        CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        setUser(authInstance.currentUser.get().getBasicProfile());
        authInstance.isSignedIn.listen((isSigned) => {
          setIsSignedIn(isSigned);
          setUser(isSigned ? authInstance.currentUser.get().getBasicProfile() : null);
        });
      }).catch((err) => console.error(err));
    }

    gapi.load("client:auth2", initClient);
  }, []);

  const signIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier use
export const useAuth = () => useContext(AuthContext);
