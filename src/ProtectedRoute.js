import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, requiredRole, userRole }) => {
  console.log(isAuthenticated, requiredRole, userRole)
  if (isAuthenticated && userRole === requiredRole) {
    return element; // 조건에 맞는 경우 렌더링
  } else {
    return <Navigate to="/" replace />; // 조건에 맞지 않는 경우 리디렉션
  }
};

export default ProtectedRoute;
