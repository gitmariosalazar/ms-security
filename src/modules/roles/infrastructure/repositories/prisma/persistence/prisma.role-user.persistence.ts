import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceRoleUserRepository } from 'src/modules/roles/domain/contracts/role-user.repository.interface';
import { RoleUserResponse } from 'src/modules/roles/domain/schemas/dto/response/role-user.response';
import { RoleUserModel } from 'src/modules/roles/domain/schemas/model/role-users.model';
import { statusCode } from 'src/settings/environments/status-code';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { RoleUserAdapter } from '../adapters/prisma.role-user.adapter';

@Injectable()
export class RoleUserPrismaImplementation
  implements InterfaceRoleUserRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(roleUser: RoleUserModel): Promise<RoleUserResponse | null> {
    try {
      const roleUserFound = await this.prismaService.roleUser.findFirst({
        where: {
          id_user: roleUser.getUser().getIdUser(),
          id_user_type: roleUser.getUserType().getIdUserType(),
        },
      });
      if (roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `RoleUser with id ${roleUser.getIdRoleUser()} already exists`,
        });
      }

      const newRoleUser = await this.prismaService.roleUser.create({
        data: {
          id_user: roleUser.getUser().getIdUser(),
          id_user_type: roleUser.getUserType().getIdUserType(),
        },
      });

      if (!newRoleUser) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error creating RoleUser`,
        });
      }

      return RoleUserAdapter.fromRoleUserPrismaToRoleUserResponse(newRoleUser);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idRoleUser: number,
    roleUser: Partial<RoleUserModel>,
  ): Promise<RoleUserResponse | null> {
    try {
      const roleUserFound = await this.prismaService.roleUser.findUnique({
        where: { idRoleUser: idRoleUser },
      });

      if (!roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with id ${idRoleUser} not found`,
        });
      }

      const roleUserFoundByUserIdAndUserTypeId =
        await this.prismaService.roleUser.findFirst({
          where: {
            id_user: roleUser.getUser().getIdUser() || roleUserFound.id_user,
            id_user_type:
              roleUser.getUserType().getIdUserType() ||
              roleUserFound.id_user_type,
          },
        });

      if (roleUserFoundByUserIdAndUserTypeId) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `RoleUser with user id ${roleUser.getUser().getIdUser()} and user type id ${roleUser.getUserType().getIdUserType()} already exists`,
        });
      }

      const updatedRoleUser = await this.prismaService.roleUser.update({
        where: { idRoleUser: idRoleUser },
        data: {
          id_user: roleUser.getUser().getIdUser() || roleUserFound.id_user,
          id_user_type:
            roleUser.getUserType().getIdUserType() ||
            roleUserFound.id_user_type,
        },
      });

      if (!updatedRoleUser) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Error updating RoleUser`,
        });
      }

      return RoleUserAdapter.fromRoleUserPrismaToRoleUserResponse(
        updatedRoleUser,
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(idRoleUser: number): Promise<RoleUserResponse | null> {
    try {
      const roleUser = await this.prismaService.roleUser.findUnique({
        where: { idRoleUser: idRoleUser },
      });

      if (!roleUser) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with id ${idRoleUser} not found`,
        });
      }

      return RoleUserAdapter.fromRoleUserPrismaToRoleUserResponse(roleUser);
    } catch (error) {
      throw error;
    }
  }

  async findByUserIdAndRoleId(
    idUser: string,
    idRole: number,
  ): Promise<RoleUserResponse | null> {
    try {
      const roleUser = await this.prismaService.roleUser.findFirst({
        where: {
          id_user: idUser,
          id_user_type: idRole,
        },
      });

      if (!roleUser) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with user id ${idUser} and role id ${idRole} not found`,
        });
      }

      return RoleUserAdapter.fromRoleUserPrismaToRoleUserResponse(roleUser);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<RoleUserResponse[]> {
    try {
      const roleUsers = await this.prismaService.roleUser.findMany();

      if (!roleUsers || roleUsers.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No RoleUsers found`,
        });
      }

      return roleUsers.map(
        RoleUserAdapter.fromRoleUserPrismaToRoleUserResponse,
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idRoleUser: number): Promise<boolean> {
    try {
      const roleUser = await this.prismaService.roleUser.findUnique({
        where: { idRoleUser: idRoleUser },
      });

      if (!roleUser) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with id ${idRoleUser} not found`,
        });
      }

      await this.prismaService.roleUser.delete({
        where: { idRoleUser: idRoleUser },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
