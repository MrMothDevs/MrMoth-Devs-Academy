const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
    price: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    lasting: {
      type: String,
      required: true,
    },
    modules: {
      type: String,
      required: true,
    }
  });
  
  module.exports = new mongoose.model("Courses", CoursesSchema);