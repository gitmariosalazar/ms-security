import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { statusCode } from 'src/settings/environments/status-code';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';

@Injectable()
export class UserTypePrismaImplementation
  implements InterfaceUserTypeRepository
{
  constructor(private readonly prismaService: PrismaService) {}
  async create(userTypeModel: UserTypeModel): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.prismaService.userType.findFirst({
        where: { name: userTypeModel.getName() },
      });

      if (userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `User type with name "${userTypeModel.getName()}" already exists.`,
        });
      }

      const userType = await this.prismaService.userType.create({
        data: {
          name: userTypeModel.getName(),
          description: userTypeModel.getDescription(),
        },
      });

      if (!userType || userType === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user type.',
        });
      }

      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUserType: number,
    userTypeModel: UserTypeModel,
  ): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.prismaService.userType.findUnique({
        where: { id_user_type: idUserType },
      });

      if (!userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }

      const userType = await this.prismaService.userType.update({
        where: { id_user_type: idUserType },
        data: {
          name: userTypeModel.getName(),
          description: userTypeModel.getDescription(),
        },
      });

      if (!userType || userType === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update user type.',
        });
      }
      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(idUserType: number): Promise<boolean> {
    try {
      const userTypeFound = await this.prismaService.userType.findUnique({
        where: { id_user_type: idUserType },
      });

      if (!userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }

      const deleted = await this.prismaService.userType.delete({
        where: { id_user_type: idUserType },
      });

      if (!deleted) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete user type.',
        });
      }
      return !!deleted;
    } catch (error) {
      throw error;
    }
  }

  async findById(idUserType: number): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.prismaService.userType.findUnique({
        where: { id_user_type: Number(idUserType) },
      });

      if (!userTypeFound || userTypeFound === null) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }

      return {
        idUserType: userTypeFound.id_user_type,
        name: userTypeFound.name,
        description: userTypeFound.description,
        createdAt: userTypeFound.created_at,
        updatedAt: userTypeFound.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserTypeResponse[]> {
    try {
      const userTypes = await this.prismaService.userType.findMany();
      if (!userTypes || userTypes.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No user types found.',
        });
      }

      return userTypes.map((userType) => ({
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.prismaService.userType.findFirst({
        where: { name },
      });

      if (!userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with name "${name}" not found.`,
        });
      }

      return {
        idUserType: userTypeFound.id_user_type,
        name: userTypeFound.name,
        description: userTypeFound.description,
        createdAt: userTypeFound.created_at,
        updatedAt: userTypeFound.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async findLikeName(name: string): Promise<UserTypeResponse[]> {
    try {
      const userTypes = await this.prismaService.userType.findMany({
        where: {
          name: {
            contains: name,
          },
        },
      });

      if (!userTypes || userTypes.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No user types found matching the name "${name}".`,
        });
      }

      return userTypes.map((userType) => ({
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  }
}
