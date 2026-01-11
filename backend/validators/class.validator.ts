import z from "zod";

export const createClassSchema = z.object({
  className: z.string().min(1, "Class name is required"),
});

export const addStudentToClassSchema = z.object({
  studentId: z.string().min(1, "Studend id is required"),
});
