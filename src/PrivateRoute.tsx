import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authentication from './serveur/authentication';
  
const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={(props) => {
    const isAuthenticated = Authentication.isAuthenticated;
    if (!isAuthenticated) {    
      return <Redirect to={{ pathname: '/login' }} />
    }
  
    return <Component {...props} />
  }} />
);
  
export default PrivateRoute;