import { Platform } from 'react-native';

export const containerStyle = {
  paddingHorizontal: 16,
  paddingVertical: 10,
};

export const titleTextStyles = {
  fontSize: 22,
  fontFamily: 'yakan',
  marginTop: 80,
};

export const MainTabTitleTextStyle = {
  textAlign: 'center',
  marginVertical: 10,
  fontFamily: 'yakan',
  fontSize: 20,
  color: '#17202a',
};

export const shadowStyle = Platform.select({
  ios: { shadowColor: '#163a2a', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  android: { elevation: 2 },
});
