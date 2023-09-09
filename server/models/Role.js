const mongoose = require("mongoose");

const { Schema } = mongoose;

const roleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  department: [
    {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
