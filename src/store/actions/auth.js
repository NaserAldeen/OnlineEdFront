import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER, SET_ERROR } from "./actionTypes";
import instance from "./instance";
import axios from "axios";

export const login = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(setCurrentUser());

      const res = await instance.post("/login/", userData);

      const user = res.data;
      localStorage.setItem("type", user.type);
      dispatch(setCurrentUser(user.access));
      dispatch({ type: "CLEAR_ERRORS" });
    } catch (err) {
      const response = err.response;
      if (response) dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };
};

export const signup = (userData) => {
  return async (dispatch) => {
    try {
      const res = await instance.post("/signup/", userData);
      const user = res.data;
      dispatch(setCurrentUser(user.access));
      dispatch(login(userData));
    } catch (err) {
      if (err.response)
        dispatch({ type: SET_ERROR, payload: err.response.data });
    }
  };
};

const setCurrentUser = (token) => {
  return async (dispatch) => {
    let user;

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;

      user = jwt_decode(token);
      dispatch({
        type: SET_CURRENT_USER,
        payload: user,
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      delete instance.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.Authorization;

      user = null;
      dispatch({
        type: SET_CURRENT_USER,
        payload: user,
      });
    }
  };
};

export const logout = () => setCurrentUser();

export const checkForExpiredToken = () => {
  // Check for token expiration
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    const currentTimeInSeconds = Date.now() / 1000;

    // Decode token and get user info
    user = jwt_decode(token);

    // Check token expiration
    if (user.exp >= currentTimeInSeconds) {
      // Set user
      return setCurrentUser(token);
    }
  }
  return logout();
};
