import mongoose from "mongoose";
import type { IClass } from "../models/Class.model";
import { ClassRepository } from "../repositories/class.repository";
import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import type { UserRepository } from "../repositories/user.repository";
import { User } from "../models/User.model";

type CreateClassInput = {
  teacherId: string;
  className: string;
};

export class ClassService {
  private classRepository: ClassRepository;
  private userRepository: UserRepository;

  constructor(
    classRepository: ClassRepository,
    userRepository: UserRepository,
  ) {
    this.classRepository = classRepository;
    this.userRepository = userRepository;
  }

  async createClass(data: CreateClassInput) {
    const newClassData: IClass = {
      className: data.className,
      teacherId: data.teacherId,
      studentIds: [],
    };

    const newClass = await this.classRepository.createClass(newClassData);
    return newClass;
  }

  async addStudentToClass(
    classId: string,
    teacherId: string,
    newStudentId: string,
  ) {
    // check if teacher owns the class
    const currentClass = await this.classRepository.findClassById(classId);
    if (!currentClass) {
      throw new NotFoundError("Class not found");
    }
    if (currentClass.teacherId.toString() !== teacherId.toString()) {
      throw new ForbiddenError("Forbidden, not class teacher");
    }

    const user = await this.userRepository.findById(newStudentId);

    if (!user || user._id.toString() !== newStudentId) {
      throw new NotFoundError("Student not found");
    }

    const updatedClass = await this.classRepository.updateClass(
      currentClass._id,
      {
        $addToSet: { studentIds: newStudentId },
      },
    );

    if (!updatedClass) {
      throw new NotFoundError("Class not found");
    }
    return updatedClass;
  }
}
