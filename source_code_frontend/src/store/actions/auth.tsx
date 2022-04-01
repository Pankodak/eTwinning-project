import axios from "axios";
import * as actionTypes from "./actionTypes";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (
  token: string,
  username: string,
  userId: number
) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    username: username,
    userId: userId,
  };
};

export const logout = () => {
  cookies.remove("token");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};
export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: any) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

export const authFail = (error: string) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

interface response {
  code: number;
  msg: string;
  token?: string;
  expiration?: number;
  username?: string;
  userId?: number;
}

export const auth = (data: { login: string; password: string }) => {
  return (dispatch: Function) => {
    dispatch(authStart());
    axios
      .post<response>("login", { data })
      .then((res) => {
        if (res.data.code === 1) {
          //TODO logujemy chlopa
          dispatch(
            authSuccess(res.data.token!, res.data.username!, res.data.userId!)
          );
          dispatch(
            checkAuthTimeout(res.data.expiration! - new Date().getTime())
          );
          return cookies.set("token", res.data.token!, {
            expires: new Date(res.data.expiration!),
          });
        }
        dispatch(authFail(res.data.msg!));
      })
      .catch((err) => {
        dispatch(
          authFail(
            "Problem zewnętrzny, skontaktuj się z administratorem strony"
          )
        );
      });
  };
};

export const authCheckState = () => {
  return (dispatch: any) => {
    const token = cookies.get("token");
    if (!token) {
      dispatch(logout());
    } else {
      const data = {
        token: token,
      };
      axios
        .post<response>(`${process.env.PUBLIC_URL}/refresh`, {
          data,
        })
        .then((res) => {
          dispatch(
            authSuccess(res.data.token!, res.data.username!, res.data.userId!)
          );
        })
        .catch((err) => {
          dispatch(logout());
        });
    }
  };
};
