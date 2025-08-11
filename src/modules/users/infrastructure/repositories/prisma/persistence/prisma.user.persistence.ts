import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceUserRepository } from 'src/modules/users/domain/contracts/user.repository.interface';
import { UserResponse } from 'src/modules/users/domain/schemas/dto/response/user.response';
import { UserModel } from 'src/modules/users/domain/schemas/model/user.model';
import { statusCode } from 'src/settings/environments/status-code';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { UserPrismaAdapter } from '../adapters/user.prisma.adapter';

@Injectable()
export class UserPrismaImplementation implements InterfaceUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userModel: UserModel): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findFirst({
        where: { user_email: userModel.getUserEmail() },
      });

      if (userFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `User with email "${userModel.getUserEmail()}" already exists.`,
        });
      }

      const user = await this.prismaService.user.create({
        data: {
          user_email: userModel.getUserEmail(),
          user_password: userModel.getUserPassword(),
          first_name: userModel.getFirstName(),
          last_name: userModel.getLastName(),
        },
        include: {
          roleUsers: true,
        },
      });
      return UserPrismaAdapter.fromPrismaToUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUser: string,
    userModel: UserModel,
  ): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id_user: idUser },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      const user = await this.prismaService.user.update({
        where: { id_user: idUser },
        data: {
          user_email: userModel.getUserEmail(),
          first_name: userModel.getFirstName(),
          last_name: userModel.getLastName(),
        },
        include: {
          roleUsers: true,
        },
      });

      return UserPrismaAdapter.fromPrismaToUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  async findById(idUser: string): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id_user: idUser },
        include: {
          roleUsers: true,
        },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      return UserPrismaAdapter.fromPrismaToUserResponse(userFound);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(userEmail: string): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findFirst({
        where: { user_email: userEmail },
        include: {
          roleUsers: true,
        },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with email "${userEmail}" not found.`,
        });
      }

      return UserPrismaAdapter.fromPrismaToUserResponse(userFound);
    } catch (error) {
      throw error;
    }
  }

  async delete(idUser: string): Promise<boolean> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id_user: idUser },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      await this.prismaService.user.delete({
        where: { id_user: idUser },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserResponse[]> {
    try {
      const users = await this.prismaService.user.findMany({
        include: {
          roleUsers: true,
        },
      });

      if (users.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No users found.',
        });
      }

      return users.map((user) =>
        UserPrismaAdapter.fromPrismaToUserResponse(user),
      );
    } catch (error) {
      throw error;
    }
  }
}
