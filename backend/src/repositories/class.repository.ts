import type { HydratedDocument, PopulateOptions } from "mongoose";
import { Class, type IClass } from "../models/Class.model";

export interface FindOptions {
  populate?: PopulateOptions | PopulateOptions[];
  select?: string | string[];
}

type ClassPersistanceInput = {
  className: string;
};

interface IClassRepoistory {
  findClassById(
    id: string,
    options?: FindOptions,
  ): Promise<HydratedDocument<IClass> | null>;
  createClass(data: ClassPersistanceInput): Promise<HydratedDocument<IClass>>;
  updateClass(
    classId: string,
    updatedClass: Partial<IClass>,
  ): Promise<HydratedDocument<IClass> | null>;
}

export class ClassRepository implements IClassRepoistory {
  async findClassById(
    id: string,
    options?: FindOptions,
  ): Promise<HydratedDocument<IClass> | null> {
    let query = Class.findById(id);
    if (options?.populate) {
      query?.populate(options.populate);
    }

    return await query.lean(true);
  }

  async getAllClass(options?: FindOptions) {
    let query = Class.find();
    if (options?.populate) {
      query?.populate(options.populate);
    }
    return await query;
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
