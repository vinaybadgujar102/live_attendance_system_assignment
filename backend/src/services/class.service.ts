import { Types } from "mongoose";
import { type IClass } from "../models/Class.model";
import { ClassRepository } from "../repositories/class.repository";
import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import type { UserRepository } from "../repositories/user.repository";
import { UserRoles } from "../models/User.model";

interface IClassWithPopulatedStudents extends Omit<IClass, "studentIds"> {
  _id: Types.ObjectId;
  studentIds: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  }[];
}

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

  async getClassById(
    accessorId: string,
    accessorRole: UserRoles,
    classId: string,
  ) {
    const accessedClass = (await this.classRepository.findClassById(classId, {
      populate: {
        path: "studentIds",
        select: "_id name email",
      },
    })) as unknown as IClassWithPopulatedStudents;

    if (!accessedClass) {
      throw new NotFoundError("Class not found");
    }

    //check if teacher owns the class
    if (
      accessorRole === "teacher" &&
      accessedClass.teacherId.toString() !== accessorId
    ) {
      throw new ForbiddenError("Forbidden, not class teacher");
    }

    //check if student enrolled in class
    const studentEnrolled = accessedClass.studentIds;
    const isAccessorStudentPresentInTheClass = studentEnrolled.find(
      (student) => student._id.toString() === accessorId,
    );
    if (accessorRole === "student" && !isAccessorStudentPresentInTheClass) {
      throw new ForbiddenError("Forbidden, not class teacher");
    }

    return accessedClass;
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
