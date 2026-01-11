import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/app.error";
import { generateToken } from "../../utils/token.utils";
import type { IUser, UserRoles } from "../models/User.model";
import type { IUserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type CreateUserInput = {
  email: string;
  password: string;
  role: UserRoles;
  name: string;
};

type LoginUserInput = {
  email: string;
  password: string;
};

export interface IUserService {
  createUser(user: CreateUserInput): Promise<IUser>;
  getCurrentUser(token: string): Promise<IUser | null>;
  // findUserById(id: string): Promise<IUser | null>;
  login(userDetails: LoginUserInput): Promise<string>;
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

  async login({ email, password }: LoginUserInput): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });
    return token;
  }

  async getCurrentUser(userId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
