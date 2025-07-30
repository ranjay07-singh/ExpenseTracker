import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { financeTipsByState } from '../data';

export const useFinanceTips = () => {
  const [tipsData, setTipsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      const userState = geocode[0]?.region?.trim();

      if (userState && financeTipsByState[userState]) {
        setTipsData(financeTipsByState[userState]);
        setState(userState);
      }

      setLoading(false);
    })();
  }, []);

  return { tipsData, loading, state };
};
