import React, { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Nav from "./Components/Nav/Nav";
import Login from "./Components/Login/Login";
import Logout from "./Components/Logout/Logout";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import Admin from "./Components/Admin/Admin";
import * as actions from "./store/actions/index";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
type app = {
  onTryAutoSignup: () => void;
  isAuthenticated: boolean;
};
export const App: React.FC<app> = ({ onTryAutoSignup, isAuthenticated }) => {
  useEffect(() => {
    onTryAutoSignup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/authors" component={Home} />
      <Route exact path="/" component={Home} />
    </Switch>
  );
  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/admin/:table" component={Admin} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route exact path="/authors" component={Home} />
        <Route exact path="/" component={Home} />
      </Switch>
    );
  }
  return (
    <div>
      <Nav />
      {routes}
      <Footer />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
