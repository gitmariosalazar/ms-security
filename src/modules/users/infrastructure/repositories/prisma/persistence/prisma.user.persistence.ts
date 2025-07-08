import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InterfaceUserRepository } from "src/modules/users/domain/contracts/user.repository.interface";
import { UserResponse } from "src/modules/users/domain/schemas/dto/response/user.response";
import { UserModel } from "src/modules/users/domain/schemas/model/user.model";
import { statusCode } from "src/settings/environments/status-code";
import { PrismaService } from "src/shared/prisma/service/prisma.service";

@Injectable()
export class UserPrismaImplementation implements InterfaceUserRepository{
  constructor(
    private readonly prismaService: PrismaService
  ) { }
  
  async create(userModel: UserModel): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findFirst({
        where: { user_email: userModel.getUserEmail() },
      });

      if (userFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `User with email "${userModel.getUserEmail()}" already exists.`,
        })
      }

      const user = await this.prismaService.user.create({
        data: {
          user_email: userModel.getUserEmail(),
          user_password: userModel.getUserPassword(),
          first_name: userModel.getFirstName(),
          last_name: userModel.getLastName(),
          user_type: {
            connect: {
              id_user_type: userModel.getUserType().getIdUserType(),
            },
          },
        },
        include: {
          user_type: true,
        },
      });
      return {
        idUser: user.id_user,
        userEmail: user.user_email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        userActive: user.user_active,
        userType: {
          idUserType: user.id_user_type,
          name: user.user_type.name,
          description: user.user_type.description,
          createdAt: user.user_type.created_at,
          updatedAt: user.user_type.updated_at,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async update(idUser: number, userModel: UserModel): Promise<UserResponse | null> {
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
          user_type: {
            connect: {
              id_user_type: userModel.getUserType().getIdUserType(),
            },
          },
        },
        include: {
          user_type: true,
        },
      });

      return {
        idUser: user.id_user,
        userEmail: user.user_email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        userActive: user.user_active,
        userType: {
          idUserType: user.id_user_type,
          name: user.user_type.name,
          description: user.user_type.description,
          createdAt: user.user_type.created_at,
          updatedAt: user.user_type.updated_at,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(idUser: number): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id_user: idUser },
        include: {
          user_type: true,
        },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      return {
        idUser: userFound.id_user,
        userEmail: userFound.user_email,
        firstName: userFound.first_name,
        lastName: userFound.last_name,
        createdAt: userFound.created_at,
        updatedAt: userFound.updated_at,
        userActive: userFound.user_active,
        userType: {
          idUserType: userFound.id_user_type,
          name: userFound.user_type.name,
          description: userFound.user_type.description,
          createdAt: userFound.user_type.created_at,
          updatedAt: userFound.user_type.updated_at,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(userEmail: string): Promise<UserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findFirst({
        where: { user_email: userEmail },
        include: {
          user_type: true,
        },
      });

      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with email "${userEmail}" not found.`,
        });
      }

      return {
        idUser: userFound.id_user,
        userEmail: userFound.user_email,
        firstName: userFound.first_name,
        lastName: userFound.last_name,
        createdAt: userFound.created_at,
        updatedAt: userFound.updated_at,
        userActive: userFound.user_active,
        userType: {
          idUserType: userFound.id_user_type,
          name: userFound.user_type.name,
          description: userFound.user_type.description,
          createdAt: userFound.user_type.created_at,
          updatedAt: userFound.user_type.updated_at,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(idUser: number): Promise<boolean> {
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
          user_type: true,
        },
      });

      if (users.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No users found.',
        });
      }

      return users.map(user => ({
        idUser: user.id_user,
        userEmail: user.user_email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        userActive: user.user_active,
        userType: {
          idUserType: user.id_user_type,
          name: user.user_type.name,
          description: user.user_type.description,
          createdAt: user.user_type.created_at,
          updatedAt: user.user_type.updated_at,
        },
      }));
    } catch (error) {
      throw error;
    }
  }

}