import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setLoading,
  setUser,
  clearUser,
  setError,
  clearError,
} from "../state/auth.slice";

import authService from "../services/auth.service";


const useAuth = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const login = useCallback(
    async (credentials) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const response = await authService.login(credentials);

        dispatch(setUser(response.data.user));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.user?.message || "Unable to login. Please try again.";

        dispatch(setError(message));
        dispatch(setLoading(false));

        throw error;
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (userData) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const response = await authService.register(userData);

        dispatch(setUser(response.data.user));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to create your account. Please try again.";

        dispatch(setError(message));
        dispatch(setLoading(false));

        throw error;
      }
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      await authService.logout();
    } catch {
      // Logout locally even if the API request fails.
    } finally {
      dispatch(clearUser());
    }
  }, [dispatch]);

  const getCurrentUser = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const response = await authService.getCurrentUser();

      dispatch(setUser(response.data.user));

      return response;
    } catch (error) {
      dispatch(clearUser());
      throw error;
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    clearAuthError,
  };
};

export default useAuth;
