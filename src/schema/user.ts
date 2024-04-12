import { Schema, model } from 'mongoose'
import { IUser } from '../model/user'

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true },
    avatar: { type: String },
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    registeredAt: { type: Date, required: true },
    birthDate: { type: Date },
    deleteDate: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
)

export const UserModel = model<IUser>('User', userSchema)
