import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["admin", "refiller", "viewer"], default: "refiller" }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);