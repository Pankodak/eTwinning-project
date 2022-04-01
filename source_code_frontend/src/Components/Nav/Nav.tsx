import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../img/misiu.png";
import "./Nav.css";

type nav = {
  isAuthenticated: boolean;
  username: string;
};
const Nav: React.FC<nav> = ({ isAuthenticated, username }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        <img
          src={logo}
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt=""
        />
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar1"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbar1">
        <ul className="navbar-nav ml-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="nav-link">Hello {username}!</span>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/logout">
                  Logout
                </NavLink>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/login">
                Login
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink className="nav-link" to="/authors">
              Authors
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
  };
};

export default connect(mapStateToProps)(Nav);
