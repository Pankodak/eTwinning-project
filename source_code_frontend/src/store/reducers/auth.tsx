import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  username: null,
};
const authStart = (state: any, action: any) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state: any, action: any) => {
  return updateObject(state, {
    token: action.idToken,
    error: null,
    loading: false,
    username: action.username,
    userId: action.userId,
  });
};

const authFail = (state: any, action: any) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state: any, action: any) => {
  return updateObject(state, { token: null, userId: null });
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
