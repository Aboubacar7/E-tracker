const mongoose = require("mongoose");

const { Schema } = mongoose;

const employeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
  manager: [
    {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
