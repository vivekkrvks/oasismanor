import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import Home from "../Website/Home";
import Login from "./Login";
import Blog from "../Website/Blog";
import Dashboard from "./Dashboard";
import AddUser from "./AddUser";
import About from "../Website/About";
import Amenities from "../Website/Amenities";
import Pricing from "../Website/Pricing";
import PrivateRoute from "./PrivateRoute";
import Payment from "../Website/Payment";
import Receipt from "../Website/Receipt";
import AddFacilities from "./AddFacility";
import RequestFacilities from "../Website/RequestFacilities";
import Utility from "../Website/Utility";
import Contact from "../Website/Contact";
import Transaction from "../Website/Transaction";
// Check for token
if (localStorage.token) {
  // Set auth token header auth
  setAuthToken(localStorage.token);
  // // Decode token and get user info and exp
  // const decoded = jwt_decode(localStorage.jwtToken);
  // // Set user and isAuthenticated
  // store.dispatch(setCurrentUser(decoded));

  // // Check for expired token
  // const currentTime = Date.now() / 1000;
  // if (decoded.exp < currentTime) {
  //   // Logout user
  //   store.dispatch(logoutUser());
  //   // Clear current Profile
  //   //store.dispatch(clearCurrentProfile());
  //   // Redirect to login
  //   window.location.href = "/login";
  // }
}

export class MainRoute extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/about" exact component={About} />
        <Route path="/amenities" exact component={Amenities} />
        <Route path="/blog" exact component={Blog} />
        <Route path="/pricing" exact component={Pricing} />
        <Route path="/contact" exact component={Contact} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/adduser" component={AddUser} />
        <PrivateRoute path="/utility" component={Utility} />
        <PrivateRoute path="/addfacility" component={AddFacilities} />
        <PrivateRoute path="/requestfacilities" component={RequestFacilities} />
        <PrivateRoute path="/payment" component={Payment} />
        <PrivateRoute path="/receipt" component={Receipt} />
        <PrivateRoute path="/transaction" component={Transaction} />
      </Switch>
    );
  }
}

export default MainRoute;
