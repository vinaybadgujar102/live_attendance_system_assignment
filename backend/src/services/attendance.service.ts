import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import { createActiveAttendanceSession } from "../infrastructure/attendanceState";
import { AttendanceRepository } from "../repositories/attendance.repository";
import type { ClassRepository } from "../repositories/class.repository";

export class AttendanceService {
  classRepository: ClassRepository;
  attendanceRepository: AttendanceRepository;

  constructor(
    classRepository: ClassRepository,
    attendanceRepository: AttendanceRepository,
  ) {
    this.classRepository = classRepository;
    this.attendanceRepository = attendanceRepository;
  }

  async startAttendance(classId: string, teacherId: string) {
    const accessedClass = await this.classRepository.findClassById(classId);
    if (!accessedClass) {
      throw new NotFoundError("Class not found");
    }

    if (accessedClass.teacherId.toString() !== teacherId) {
      throw new ForbiddenError("Forbidden, not class teacher");
    }

    const newSession = createActiveAttendanceSession({
      classId,
      startedAt: new Date().toISOString(),
      attendance: {},
    });

    return newSession;
  }

  async getMyAttendance(classId: string, studentId: string) {
    const accessedClass = await this.classRepository.findClassById(classId);
    if (!accessedClass) {
      throw new NotFoundError("Class not found");
    }
    const isStudentInClass = accessedClass.studentIds.find(
      (currentStudentId) => currentStudentId.toString() === studentId,
    );
    if (!isStudentInClass) {
      throw new ForbiddenError("Forbidden, not enrolled in class");
    }
    const getAttendance =
      await this.attendanceRepository.getAttendanceForStudentByClass(
        studentId,
        classId,
      );
    return getAttendance;
  }
}
