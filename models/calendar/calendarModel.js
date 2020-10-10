import mongoose from "mongoose";
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  calendar_items: [
    {
      type: Schema.Types.ObjectId,
      ref: "CalendarItem",
      required: false,
    },
  ],
  reminders: [
    {
        type: Schema.Types.ObjectId,
        ref: "Reminder",
        required: false,
      },
  ]
});

export default mongoose.model("Calendar", calendarSchema);
