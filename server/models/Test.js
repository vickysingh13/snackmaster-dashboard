import mongoose from "mongoose";

const testSchema = mongoose.Schema({
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Test", testSchema);
