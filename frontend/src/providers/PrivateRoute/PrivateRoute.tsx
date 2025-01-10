import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
