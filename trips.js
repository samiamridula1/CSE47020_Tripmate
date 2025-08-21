import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  details: { type: String },
});

export default mongoose.model("Trip", tripSchema);
