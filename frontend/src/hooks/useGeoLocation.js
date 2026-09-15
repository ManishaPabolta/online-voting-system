import {
  useCallback,
  useEffect,
  useState,
} from "react";

const initialLocation = {
  latitude: null,
  longitude: null,
  accuracy: null,
  error: null,
  loading: true,
};

const useGeoLocation = (
  options = {}
) => {
  const [
    location,
    setLocation,
  ] = useState(
    initialLocation
  );

  const getLocation =
    useCallback(() => {
      if (
        !navigator.geolocation
      ) {
        setLocation({
          latitude: null,
          longitude: null,
          accuracy: null,
          error:
            "Geolocation is not supported by this browser.",
          loading: false,
        });

        return;
      }

      setLocation(
        (previous) => ({
          ...previous,
          loading: true,
          error: null,
        })
      );

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude:
              position.coords
                .latitude,

            longitude:
              position.coords
                .longitude,

            accuracy:
              position.coords
                .accuracy ?? null,

            error: null,
            loading: false,
          });
        },

        (error) => {
          let message =
            "Unable to get your location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Location permission was denied. Please allow location access to continue voting.";
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                "Your current location is unavailable.";
              break;

            case error.TIMEOUT:
              message =
                "Location request timed out. Please try again.";
              break;

            default:
              message =
                error.message ||
                "Unable to get your location.";
          }

          setLocation({
            latitude: null,
            longitude: null,
            accuracy: null,
            error: message,
            loading: false,
          });
        },

        {
          enableHighAccuracy:
            options.enableHighAccuracy ??
            true,

          timeout:
            options.timeout ??
            15000,

          maximumAge:
            options.maximumAge ??
            0,
        }
      );
    }, [
      options.enableHighAccuracy,
      options.timeout,
      options.maximumAge,
    ]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    ...location,
    getLocation,
  };
};

export default useGeoLocation;