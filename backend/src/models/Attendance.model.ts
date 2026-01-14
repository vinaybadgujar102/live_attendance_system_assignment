import { Schema, model } from "mongoose";

const attendanceSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["present", "absent"],
    },
  },
  {
    timestamps: true,
  },
);

export const Attendance = model("Attendance", attendanceSchema);
