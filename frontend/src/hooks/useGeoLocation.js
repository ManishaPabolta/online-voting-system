import {
  useEffect,
  useState,
} from "react";

const useGeoLocation = () => {
  const [location, setLocation] =
    useState({
      latitude: null,
      longitude: null,
      error: null,
    });

  useEffect(() => {
    if (
      !navigator.geolocation
    ) {
      setLocation({
        latitude: null,
        longitude: null,
        error:
          "Geolocation not supported",
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude:
            position.coords
              .latitude,

          longitude:
            position.coords
              .longitude,

          error: null,
        });
      },

      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          error:
            error.message,
        });
      }
    );
  }, []);

  return location;
};

export default useGeoLocation;