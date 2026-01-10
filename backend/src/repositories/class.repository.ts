import type { HydratedDocument } from "mongoose";
import { Class, type IClass } from "../models/Class.model";

type ClassPersistanceInput = {
  className: string;
};

interface IClassRepoistory {
  createClass(data: ClassPersistanceInput): Promise<HydratedDocument<IClass>>;
}

export class ClassRepository implements IClassRepoistory {
  async createClass(
    data: ClassPersistanceInput,
  ): Promise<HydratedDocument<IClass>> {
    const newClass = await Class.create(data);
    return newClass;
  }
}
