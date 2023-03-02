import mongoose from "mongoose";
//model setup//
const UserSchema = new mongoose.Schema(
  {
    bizname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    field: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true } //auto dates//
);

const User = mongoose.model("User", UserSchema);
export default User;
