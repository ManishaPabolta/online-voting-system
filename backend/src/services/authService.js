import bcrypt from "bcryptjs";

import User from "../models/User.js";

// ======================================================
// REGISTER SERVICE
// ======================================================

export const registerService = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  const normalizedName = String(name || "").trim();
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedName) {
    throw new Error("Name is required.");
  }

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!password || String(password).length < 6) {
    throw new Error(
      "Password must contain at least 6 characters."
    );
  }

  // Never allow public registration as admin
  const safeRole = role === "admin" ? "user" : role;

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    String(password),
    12
  );

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: safeRole,
  });

  return user;
};

// ======================================================
// LOGIN SERVICE
// ======================================================

export const loginService = async (
  email,
  password
) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({
    email: normalizedEmail,
  }).select(
    "+password +refreshToken +refreshTokenExpiresAt"
  );

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  if (!user.isActive) {
    throw new Error("Your account is inactive.");
  }

  if (user.isBlocked) {
    throw new Error("Your account has been blocked.");
  }

  if (!user.isVerified) {
    throw new Error(
      "Please verify your account before logging in."
    );
  }

  const isMatch = await bcrypt.compare(
    String(password),
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  return user;
};

// ======================================================
// PASSWORD COMPARE
// ======================================================

export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(
    String(plainPassword),
    hashedPassword
  );
};