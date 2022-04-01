import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../store/actions/index";
import "./Login.css";
type stringOrNull = string | null;
type login = {
  onAuth: (data: { login: string; password: string }) => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: stringOrNull;
};

const Login: React.FC<login> = ({
  onAuth,
  isAuthenticated,
  loading,
  error,
}) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const rememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      login: login,
      password: password,
      rememberMe: rememberMe,
    };
    onAuth(data);
  };
  return isAuthenticated ? (
    <Redirect to="/" />
  ) : (
    <form className="form-signin" onSubmit={onSubmitHandler}>
      <img
        className="mb-4"
        src="https://cdn.podimo.com/images/c0ec586a-29ae-41eb-92be-07d28dded1dc_400x400.png"
        alt=""
        width="80"
        height="80"
        style={{ borderRadius: "5px" }}
      />
      <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label htmlFor="inputEmail" className="sr-only">
        Email address
      </label>
      <input
        type="email"
        id="inputEmail"
        className="form-control"
        placeholder="Email address"
        required
        onChange={handleLoginChange}
        value={login}
      />
      <label htmlFor="inputPassword" className="sr-only">
        Password
      </label>
      <input
        type="password"
        id="inputPassword"
        className="form-control"
        placeholder="Password"
        required
        onChange={handlePasswordChange}
        value={password}
        minLength={6}
      />
      <div className="checkbox mb-3">
        <label>
          <input
            type="checkbox"
            onChange={rememberMeChange}
            checked={rememberMe}
          />
          Remember me
        </label>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
      )}
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onAuth: (data: { login: string; password: string }) =>
      dispatch(actions.auth(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
