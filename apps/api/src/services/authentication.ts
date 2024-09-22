import { PrismaClient } from '@saas-monorepo/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  AuthCheckPayload,
  AuthCheckResult,
  ForgotPayload,
  ForgotResult,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
  ResetPayload,
} from '../types/auth.js';
import { AbstractServiceOptions } from '../types/services.js';

export class AuthenticationService {
  prisma: PrismaClient;
  constructor(options: AbstractServiceOptions) {
    this.prisma = options.prisma;
  }

  async login(payload: LoginPayload) {
    let user = null;
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: { username: payload.username.toLowerCase() },
        select: {
          username: true,
          id: true,
          password: true,
          role: true,
        },
      });
    } catch (err) {
      throw new Error('invalid credentials');
    }
    const isPasswordValid = await this.validatePassword(payload.password, user.password as string);

    if (!isPasswordValid) {
      throw new Error('invalid credentials');
    }
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const accessToken = jwt.sign(tokenPayload, process.env['ACCESS_TOKEN_SECRET'] as string, {
      expiresIn: process.env['ACCESS_TOKEN_TTL'],
    });
    return {
      accessToken,
      user,
    };
  }
  async register(payload: RegisterPayload) {
    let user = null;
    user = await this.prisma.user.findUnique({
      where: { username: payload.username.toLowerCase() },
      select: {
        username: true,
        id: true,
        password: true,
      },
    });
    if (user) {
      throw new Error('user already exist');
    }

    const hashedPassword = await this.hashPassword(payload.password);
    user = await this.prisma.user.create({
      data: {
        username: payload.username,
        password: hashedPassword,
      },
    });
    return user;
  }

  async authCheck(payload: AuthCheckPayload) {
    let user = null;

    console.log(payload);
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: { id: payload.id },
        select: {
          username: true,
          id: true,
        },
      });
    } catch (err) {
      throw new Error('Not Found');
    }
    return user;
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  private async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
