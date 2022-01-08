import React from 'react';
import { Route, Redirect } from 'react-router-dom';
 
// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => rest.isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/Kirjautuminen', state: { from: props.location } }} />}
    />
  )
}
 
export default PrivateRoute;