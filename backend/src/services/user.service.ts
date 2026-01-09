import { ConflictError } from "../../utils/app.error";
import type { IUser, UserRoles } from "../models/User.model";
import type { IUserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";

type CreateUserInput = {
  email: string;
  password: string;
  role: UserRoles;
  name: string;
};

export interface IUserService {
  createUser(user: Partial<IUser>): Promise<IUser>;
  // findUserById(id: string): Promise<IUser | null>;
  // findUserByEmail(email: string): Promise<IUser | null>;
  // updateUser(id: string, user: IUser): Promise<IUser | null>;
  // deleteUser(id: string): Promise<void>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(user: CreateUserInput): Promise<IUser> {
    // check if user already exists
    const userExists = await this.userRepository.findByEmail(user.email);
    if (userExists) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassord = await bcrypt.hash(user.password, 10);
    return this.userRepository.create({
      ...user,
      password: hashedPassord,
    });
  }
}
