import { Schema, model } from "mongoose";

const classSchema = new Schema(
  {
    className: {
      type: String,
      unique: true,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Class = model("Class", classSchema);
