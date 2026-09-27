import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./src/navigations/StackNavigation";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WorkerProvider } from "./src/contexts/WorkerInfoContext";
import { AppProvider } from "./src/contexts/AppContext";
import { InternerCheckerProvider } from "./src/contexts/InternetChecker";
import * as Navigation from "expo-navigation-bar";
import InternetBanner from "./src/components/App/InternetBanner";
import { LocationProvider } from "./src/contexts/LocationsContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    yakan: require("./assets/fonts/Yekan.ttf"),
    lalezar: require("./assets/fonts/Lalezar-Regular.ttf"),
  });

  // 3. Hide the splash screen once fonts are loaded (or if an error happens)
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    Navigation.setVisibilityAsync("hidden");
  }, []);

  // 4. Force the app to stay on the splash screen until fonts are ready
  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <InternerCheckerProvider>
          <LocationProvider>
            <AppProvider>
              <AuthProvider>
                <WorkerProvider>
                  <StackNavigation />
                  <Toast />
                  <InternetBanner />
                </WorkerProvider>
              </AuthProvider>
            </AppProvider>
          </LocationProvider>
        </InternerCheckerProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
