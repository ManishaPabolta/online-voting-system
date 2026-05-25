export const saveLocation =
  async ({
    latitude,
    longitude,
    ipAddress,
  }) => {
    return {
      latitude,
      longitude,
      ipAddress,
    };
  };

export const validateLocation =
  async (
    latitude,
    longitude
  ) => {
    if (
      !latitude ||
      !longitude
    ) {
      throw new Error(
        "Invalid location"
      );
    }

    return true;
  };