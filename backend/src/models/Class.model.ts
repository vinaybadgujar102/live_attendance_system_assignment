import { Schema, model } from "mongoose";

export interface IClass {
  className: string;
  teacherId: Schema.Types.ObjectId | string;
  studentIds: Schema.Types.ObjectId[] | string[];
}

const classSchema = new Schema<IClass>(
  {
    className: {
      type: String,
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
  { timestamps: true },
);

export const Class = model("Class", classSchema);
