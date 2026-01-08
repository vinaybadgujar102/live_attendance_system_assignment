import { User, type IUser } from "../models/User.model";

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, user: IUser): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
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

  async update(id: string, user: IUser): Promise<IUser | null> {
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
