"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import apiService, { login as apiLogin, register as apiRegister, logout as apiLogout, updateProfile as apiUpdateProfile, getProfile } from "@/lib/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     getProfile()
  //       .then((user) => {
  //         dispatch({
  //           type: "LOGIN_SUCCESS",
  //           payload: { user, token },
  //         });
  //       })
  //       .catch(() => {
  //         localStorage.removeItem("token");
  //         dispatch({ type: "LOGOUT" });
  //       });
  //   } else {
  //     dispatch({ type: "LOGOUT" });
  //   }
  // }, []);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (token) {
    getProfile()
      .then((user) => {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      })
      .catch((error) => {
        console.error("getProfile failed in AuthProvider:", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        });
        // yahan token mat hatao
        // localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      });
  } else {
    dispatch({ type: "LOGOUT" });
  }
}, []);


  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await apiLogin(credentials);
      localStorage.setItem("token", response.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await apiRegister(userData);
      localStorage.setItem("token", response.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiUpdateProfile(profileData);
      dispatch({ type: "UPDATE_PROFILE", payload: response.user });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
