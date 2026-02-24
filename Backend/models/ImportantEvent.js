import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  summary:         { type: String },
  start:           { dateTime: { type: String, required: true } },
  end:             { dateTime: { type: String } },
  email:           { type: String, required: true, lowercase: true },
  eventId:         { type: String },
  youAreAnAttendee:{ type: Boolean, default: false },
  isAfterHours:    { type: Boolean, default: false },
  importanceReason: { type: String,   default: "" },            // primary: keyword | attendee | organizer | highImportance
  importanceReasons:{ type: [String], default: [] },            // ALL matching reasons
  status:          { type: String, default: "Pending" },
  response:        { type: String, default: "None" },
  createdAt:       { type: Date,   default: Date.now },
});

export default mongoose.model("ImportantEvent", eventSchema);
