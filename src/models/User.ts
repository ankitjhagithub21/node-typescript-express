import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * User Roles
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

/**
 * User Interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔒 do not return password by default
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    versionKey: false,
  }
);



/**
 * User Model
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
