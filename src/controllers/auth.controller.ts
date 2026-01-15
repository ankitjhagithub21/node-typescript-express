import { Request, Response, NextFunction } from "express";
import User, { UserRole } from "../models/User";
import bcrypt from "bcryptjs"

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    // 2️⃣ Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      role: UserRole.USER,
    });

    // 4️⃣ Response (never send password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {  email, password } = req.body;
    // 2️⃣ Check existing user
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password,user.password)

      if (!isValidPassword) {
      res.status(400).json({
        success: false,
        message: "Wrong credentials.",
      });
      return;
    }


    // 4️⃣ Response (never send password)
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
