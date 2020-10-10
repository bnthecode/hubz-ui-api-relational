import mongoose from "mongoose";
const Schema = mongoose.Schema;

const calendarItemSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  recurring: {
    type: Boolean,
    required: true,
  },
  reminders: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator_id: {
      type: Schema.Types.ObjectId,
      required: true
  }
});

export default mongoose.model("CalendarItem", calendarItemSchema);
