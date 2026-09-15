import jwt from "jsonwebtoken";

// ======================================================
// JWT SECRET
// ======================================================

const getJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return process.env.JWT_SECRET;
};

// ======================================================
// GENERATE ACCESS TOKEN
// ======================================================

export const generateAccessToken = (
  userId
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return jwt.sign(
    {
      id: String(userId),
    },
    getJWTSecret(),
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ======================================================
// BACKWARD COMPATIBILITY
// ======================================================

export const generateToken = (
  userId
) => {
  return generateAccessToken(userId);
};

// ======================================================
// VERIFY TOKEN
// ======================================================

export const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required.");
  }

  return jwt.verify(
    token,
    getJWTSecret()
  );
};

// ======================================================
// DECODE TOKEN
// ======================================================

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  return jwt.decode(token);
};