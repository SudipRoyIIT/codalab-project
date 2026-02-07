import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoute = ({ element: Component, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  console.log("This will be commign",userRole)
  console.log("This I want",userRole)

  // if (!currentUser) {
  
  //   return <Navigate to="/signin" />;
  // }

  // if (requiredRole && userRole !== requiredRole) {
  //   // alert('Authentication faild or You are not Admin')
  //   return <Navigate to="/signin" />;
  // }
  return <Component />;
};

export default ProtectedRoute;
