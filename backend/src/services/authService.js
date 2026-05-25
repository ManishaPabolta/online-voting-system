import bcrypt from "bcryptjs";

import User from "../models/User.js";

export const registerService = async (
  userData
) => {
  const {
    name,
    email,
    password,
  } = userData;

  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginService = async (
  email,
  password
) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  return user;
};