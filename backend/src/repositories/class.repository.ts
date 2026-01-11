import type { HydratedDocument } from "mongoose";
import { Class, type IClass } from "../models/Class.model";

type ClassPersistanceInput = {
  className: string;
};

interface IClassRepoistory {
  findClassById(id: string): Promise<HydratedDocument<IClass> | null>;
  createClass(data: ClassPersistanceInput): Promise<HydratedDocument<IClass>>;
  updateClass(
    classId: string,
    updatedClass: Partial<IClass>,
  ): Promise<HydratedDocument<IClass> | null>;
}

export class ClassRepository implements IClassRepoistory {
  async findClassById(id: string): Promise<HydratedDocument<IClass> | null> {
    return await Class.findById(id);
  }

  async createClass(
    data: ClassPersistanceInput,
  ): Promise<HydratedDocument<IClass>> {
    const newClass = await Class.create(data);
    return newClass;
  }

  async updateClass(
    classId: string,
    updatedClass: Partial<IClass>,
  ): Promise<HydratedDocument<IClass> | null> {
    return await Class.findByIdAndUpdate(classId, updatedClass, { new: true });
  }
}
