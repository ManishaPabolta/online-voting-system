// ======================================================
// VALIDATE LOCATION
// ======================================================

export const validateLocation = async (
  latitude,
  longitude
) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    throw new Error(
      "Latitude and longitude are required."
    );
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(
      "Latitude and longitude must be valid numbers."
    );
  }

  if (lat < -90 || lat > 90) {
    throw new Error(
      "Latitude must be between -90 and 90."
    );
  }

  if (lng < -180 || lng > 180) {
    throw new Error(
      "Longitude must be between -180 and 180."
    );
  }

  return true;
};

// ======================================================
// SAVE LOCATION DATA
// ======================================================

export const saveLocation = async ({
  latitude,
  longitude,
  ipAddress = "",
}) => {
  await validateLocation(
    latitude,
    longitude
  );

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    ipAddress: String(ipAddress || "").trim(),
  };
};

// ======================================================
// DISTANCE BETWEEN TWO LOCATIONS
// ======================================================

export const calculateDistanceInKm = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const lat1 = Number(latitude1);
  const lon1 = Number(longitude1);
  const lat2 = Number(latitude2);
  const lon2 = Number(longitude2);

  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    throw new Error("Invalid coordinates.");
  }

  const earthRadiusKm = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
};