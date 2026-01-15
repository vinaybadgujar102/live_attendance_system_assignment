import { Attendance } from "../models/Attendance.model";

export class AttendanceRepository {
  async getAttendanceForStudentByClass(studentId: string, classId: string) {
    const attendanceSession = await Attendance.findOne({
      studentId: studentId,
      classId: classId,
    });
    return attendanceSession;
  }
}
