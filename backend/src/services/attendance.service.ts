import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import { createActiveAttendanceSession } from "../infrastructure/attendanceState";
import type { ClassRepository } from "../repositories/class.repository";

export class AttendanceService {
  classRepository: ClassRepository;

  constructor(classRepository: ClassRepository) {
    this.classRepository = classRepository;
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
}
