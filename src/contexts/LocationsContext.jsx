import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Location from "expo-location";

const LocationContext = createContext(null);

// تبدیل نام ولایت‌ها به دری
const provinceMap = {
  Kabul: "کابل",
  Kandahar: "کندهار",
  Herat: "هرات",
  Balkh: "بلخ",
  Kunduz: "کندز",
  Takhar: "تخار",
  Baghlan: "بغلان",
  Badakhshan: "بدخشان",
  Samangan: "سمنگان",
  Bamyan: "بامیان",
  Faryab: "فاریاب",
  Jowzjan: "جوزجان",
  Jawzjan: "جوزجان",
  "Sar-e Pol": "سرپل",
  "Sari Pul": "سرپل",
  Nangarhar: "ننگرهار",
  Laghman: "لغمان",
  Nuristan: "نورستان",
  Kunar: "کنر",
  Paktia: "پکتیا",
  Paktika: "پکتیکا",
  Khost: "خوست",
  Logar: "لوگر",
  Wardak: "وردک",
  Ghazni: "غزنی",
  Zabul: "زابل",
  Uruzgan: "ارزگان",
  Daykundi: "دایکندی",
  Ghor: "غور",
  Farah: "فراه",
  Nimroz: "نیمروز",
  Helmand: "هلمند",
  Panjshir: "پنجشیر",
  Parwan: "پروان",
  Kapisa: "کاپیسا",
};

const cityMap = {
  Kunduz: "کندز",
  Taloqan: "تالقان",
  "Taleqan": "تالقان",
  Kabul: "کابل",
  Herat: "هرات",
  Kandahar: "کندهار",
  Mazar: "مزار شریف",
  "Mazar-i-Sharif": "مزار شریف",
};

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // گرفتن اجازه دسترسی به موقعیت
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("اجازه دسترسی به موقعیت داده نشد");
        setLoading(false);
        return;
      }

      // گرفتن موقعیت فعلی
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const { latitude, longitude } =
        currentLocation.coords;

      // تبدیل مختصات به نام مکان
      const places = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const place = places?.[0];

      const province =
        provinceMap[place?.region] ||
        place?.region ||
        null;

      const city =
        cityMap[place?.city] ||
        place?.city ||
        null;

      setLocation({
        latitude,
        longitude,
        province,
        city,
        district: place?.district || null,
        country: place?.country || null,
      });
    } catch (err) {
      console.log("Location Error:", err);

      setError("گرفتن موقعیت با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  // گرفتن موقعیت هنگام شروع برنامه
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        refreshLocation: getLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocation باید داخل LocationProvider استفاده شود"
    );
  }

  return context;
}