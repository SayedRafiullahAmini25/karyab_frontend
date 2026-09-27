import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const InternerCheckerContext = createContext();

export function InternerCheckerProvider({ children }) {
  const [hasInternet, setHasInternet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const checkInternet = async () => {
    try {
      const state = await NetInfo.fetch();
      setHasInternet(state.isConnected === true);
    } catch {
      setHasInternet(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    checkInternet();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (mounted) {
        setHasInternet(state.isConnected === true);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <InternerCheckerContext.Provider value={{ hasInternet, checkInternet, isLoading }}>
      {children}
    </InternerCheckerContext.Provider>
  );
}

export function userInternetChecker() {
  return useContext(InternerCheckerContext);
}
