// import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema({
//   summary: String,
//   start: {
//     dateTime: {
//       type: Date,
//       required: true,
//     },
//   },
//   end: {
//     dateTime: {
//       type: Date,
//       required: true,
//     },
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//   },
//   eventId: String,
//   youAreAnAttendee: Boolean,
//   status: { type: String, default: "Pending" },
//   response: { type: String, default: "None" },
// });

// const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);
// export default ImportantEvent;




import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  summary: String,
  start: {
    dateTime: {
      type: Date,
      required: true,
    },
  },
  end: {
    dateTime: {
      type: Date,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  eventId: String,
  youAreAnAttendee: Boolean,
  status: { type: String, default: "Pending" },
  response: { type: String, default: "None" },
});

const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);
export default ImportantEvent;
