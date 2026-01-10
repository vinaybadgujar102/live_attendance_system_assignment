import type { IClass } from "../models/Class.model";
import { ClassRepository } from "../repositories/class.repository";

type CreateClassInput = {
  teacherId: string;
  className: string;
};

export class ClassService {
  private classRepository: ClassRepository;

  constructor(classRepository: ClassRepository) {
    this.classRepository = classRepository;
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
}
