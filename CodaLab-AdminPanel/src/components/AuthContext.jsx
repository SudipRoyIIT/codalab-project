import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import { firebaseAppAdmin, firebaseAppSubAdmin } from "./firbase";

const AuthContext = React.createContext();
const Admin = getAuth(firebaseAppAdmin);
const Subadmin = getAuth(firebaseAppSubAdmin);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const userRoleFromLocalStorage = localStorage.getItem("userInfo");
  const [userRole, setUserRole] = useState(" ");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRoleFromLocalStorage) {
      console.log("Hello world from user");
      setCurrentUser(userRoleFromLocalStorage);
      setUserRole(userRoleFromLocalStorage);
      setLoading(false);
    } else {
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
    }
  }, []);

  console.log("This is form to want to set the data", userRoleFromLocalStorage);
  console.log("This is propes data", userRole);

  // ✅ Firebase auth state listener ko hata diya kyunki Firebase use nahi kar rahe
  // Tum sirf localStorage se data le rahe ho

  const value = {
    currentUser,
    userRole,
    setCurrentUser,
    setUserRole,
    setLoading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}