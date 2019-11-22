import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  let loggedIn = true;
  const token = localStorage.getItem("token");
  if (token == null) {
    loggedIn = false;
  }
  return <Route {...rest} render={props => (loggedIn === true ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default PrivateRoute;
