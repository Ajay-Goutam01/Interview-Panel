import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import AppStore from "./AppStore";
import {
  setUser,
  setAuthInitialized,
  clearUser,
} from "../features/auth/state/auth.slice";
import authService from "../features/auth/services/auth.service";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getCurrentUser();

        dispatch(setUser(response.data.user));
      } catch {
        dispatch(clearUser());
      } finally {
        dispatch(setAuthInitialized(true));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

const AppProvider = ({ children }) => {
  return (
    <Provider store={AppStore}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
};

export default AppProvider;
