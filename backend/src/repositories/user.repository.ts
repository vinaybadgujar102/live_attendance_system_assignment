import { User, UserRoles, type IUser } from "../models/User.model";

export type UserPersistanceInput = {
  email: string;
  password: string;
  role: UserRoles;
  name: string;
};

export interface IUserRepository {
  create(user: UserPersistanceInput): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, user: UserPersistanceInput): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async create(user: UserPersistanceInput): Promise<IUser> {
    const newUser = await User.create(user);
    return newUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async update(id: string, user: UserPersistanceInput): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...user },
      { new: true, runValidators: true },
    );
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}
