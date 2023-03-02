/*
* The definition adopted for the user data structure is as described below:
*  - user_name: this field is unique, describe a user name for a specific user.
*  - user_password: the password will be enconded in order to protect the information
*/

import { Document, Schema, Model, model } from "mongoose";

export const userSchema = new Schema({
  user_name:{
    type: String,
    required:true,
    unique:true
  },
  user_password: String
});

export interface IUser extends Document {
  user_name: string;
  user_password: string;
}

export const User: Model<IUser> = model<IUser>("users", userSchema);