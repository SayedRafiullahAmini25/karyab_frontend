import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem("token")
      .then((storedToken) => {
        if (!mounted) return;
        setToken(storedToken);
        setIsLogin(Boolean(storedToken));
      })
      .catch(() => {
        if (mounted) {
          setToken(null);
          setIsLogin(false);
        }
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const values = {
    isLogin,
    setIsLogin,
    token,
    setToken,
    authLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
