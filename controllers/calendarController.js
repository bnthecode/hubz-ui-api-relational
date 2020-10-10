import Home from "../models/home/homeModel.js";
import Calendar from "../models/calendar/calendarModel.js";
import CalendarItem from "../models/calendar/calendarItemModel.js";

export const createCalendar = async (req, res) => {
  try {
    const { user_id } = req;
    const calendar = new Calendar();
    const foundHome = await Home.findOne({ creator_id: user_id });
    const savedCalendar = await calendar.save();
    foundHome.calendar_id = savedCalendar._id;
    await foundHome.save();

    res.status(201).send({
        calendar: savedCalendar,
      message: { content: "Successfully created calendar" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: {
        content: "An error occurred creating calendar",
        info: error.message,
      },
    });
  }
};

export const createCalendarItem = async (req, res) => {
    try {

      const { user_id } = req;
      const { event } = req.body;
      const { calendar_id } = req.params;
      const calendar = await Calendar.findOne({ _id: calendar_id})
        const newCalendarItem = new CalendarItem({ ...event, creator_id: user_id });
      const savedCalendarItem = await newCalendarItem.save();

      calendar.calendar_items.push(savedCalendarItem._id);
      const savedCalendar = await calendar.save();
  
      res.status(201).send({
        calendar: savedCalendar,
        message: { content: "Successfully created item" },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: {
          content: "An error occurred creating calendar item",
          info: error.message,
        },
      });
    }
  };
