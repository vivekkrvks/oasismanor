import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { MainContext } from "./MainContext";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const { userInfo } = useContext(MainContext);
  let loggedIn = true;
  if (!userInfo.token) {
    loggedIn = false;
  }
  return <Route {...rest} render={props => (loggedIn === true ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default PrivateRoute;
