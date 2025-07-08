import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceRolePermissionRepository } from 'src/modules/roles/domain/contracts/role-permission.repository.interface';
import { RolePermissionResponse } from 'src/modules/roles/domain/schemas/dto/response/role-permission.response';
import { RolesPermissionModel } from 'src/modules/roles/domain/schemas/model/role-permission.model';
import { statusCode } from 'src/settings/environments/status-code';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { RolePermissionAdapter } from '../../../adapters/role-permission.adapter';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { PermissionModel } from 'src/modules/permission/domain/schemas/model/permission.model';

@Injectable()
export class RolePermissionPrismaImplementation
  implements InterfaceRolePermissionRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    rolePermissionModel: RolesPermissionModel,
  ): Promise<RolePermissionResponse | null> {
    try {
      const rolePermissionFound =
        await this.prismaService.rolePermission.findFirst({
          where: {
            id_role_permission: rolePermissionModel.getIdRolePermission(),
            id_permission: rolePermissionModel.getPermission().getIdPermission(),
          },
        });

      if (rolePermissionFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Role permission with user type "${rolePermissionModel.getUserType().getIdUserType()}" and permission "${rolePermissionModel.getPermission().getIdPermission() }" already exists.`,
        });
      }

      const rolePermission = await this.prismaService.rolePermission.create({
        data: {
          id_user_type: rolePermissionModel.getUserType().getIdUserType(),
          id_permission: rolePermissionModel.getPermission().getIdPermission(),
        },
        include: {
          user_type: true,
          permission: true,
        },
      });

      const rolePermissionResponse: RolePermissionResponse =
        RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
          new RolesPermissionModel(
            rolePermission.id_role_permission,
            new UserTypeModel(
              rolePermission.user_type.id_user_type,
              rolePermission.user_type.name,
              rolePermission.user_type.description,
            ),
            new PermissionModel(
              rolePermission.permission.id_permission,
              rolePermission.permission.name,
              rolePermission.permission.description,
              rolePermission.permission.created_at,
              rolePermission.permission.updated_at,
            ),
          ),
        );
      return rolePermissionResponse;
    } catch (error) {
      throw error;
    }
  }

  async update(
    idRolePermission: number,
    rolePermissionRequest: RolesPermissionModel,
  ): Promise<RolePermissionResponse | null> {
    try {
      const rolePermissionFound =
        await this.prismaService.rolePermission.findUnique({
          where: { id_role_permission: idRolePermission },
        });

      if (!rolePermissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Role permission with ID "${idRolePermission}" not found.`,
        });
      }

      const rolePermission = await this.prismaService.rolePermission.update({
        where: { id_role_permission: idRolePermission },
        data: {
          id_user_type: rolePermissionRequest.getUserType().getIdUserType(),
          id_permission: rolePermissionRequest.getPermission().getIdPermission(),
        },
        include: {
          user_type: true,
          permission: true,
        },
      });

      return RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
        new RolesPermissionModel(
          rolePermission.id_role_permission,
          new UserTypeModel(
            rolePermission.user_type.id_user_type,
            rolePermission.user_type.name,
            rolePermission.user_type.description,
          ),
          new PermissionModel(
            rolePermission.permission.id_permission,
            rolePermission.permission.name,
            rolePermission.permission.description,
            rolePermission.permission.created_at,
            rolePermission.permission.updated_at,
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idRolePermission: number): Promise<boolean> {
    try {
      const rolePermissionFound =
        await this.prismaService.rolePermission.findUnique({
          where: { id_role_permission: idRolePermission },
        });

      if (!rolePermissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Role permission with ID "${idRolePermission}" not found.`,
        });
      }

      await this.prismaService.rolePermission.delete({
        where: { id_role_permission: idRolePermission },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<RolePermissionResponse[]> {
    try {
      const rolePermissions = await this.prismaService.rolePermission.findMany({
        include: {
          user_type: true,
          permission: true,
        },
      });

      if (rolePermissions.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No role permissions found.',
        });
      }

      return rolePermissions.map((rolePermission) =>
        RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
          new RolesPermissionModel(
            rolePermission.id_role_permission,
            new UserTypeModel(
              rolePermission.user_type.id_user_type,
              rolePermission.user_type.name,
              rolePermission.user_type.description,
            ),
            new PermissionModel(
              rolePermission.permission.id_permission,
              rolePermission.permission.name,
              rolePermission.permission.description,
              rolePermission.permission.created_at,
              rolePermission.permission.updated_at,
            ),
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(
    idRolePermission: number,
  ): Promise<RolePermissionResponse | null> {
    try {
      const rolePermissionFound =
        await this.prismaService.rolePermission.findUnique({
          where: { id_role_permission: idRolePermission },
          include: {
            user_type: true,
            permission: true,
          },
        });

      if (!rolePermissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Role permission with ID "${idRolePermission}" not found.`,
        });
      }

      return RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
        new RolesPermissionModel(
          rolePermissionFound.id_role_permission,
          new UserTypeModel(
            rolePermissionFound.user_type.id_user_type,
            rolePermissionFound.user_type.name,
            rolePermissionFound.user_type.description,
          ),
          new PermissionModel(
            rolePermissionFound.permission.id_permission,
            rolePermissionFound.permission.name,
            rolePermissionFound.permission.description,
            rolePermissionFound.permission.created_at,
            rolePermissionFound.permission.updated_at,
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findByUserTypeId(
    userTypeId: number,
  ): Promise<RolePermissionResponse[]> {
    try {
      const rolePermissions = await this.prismaService.rolePermission.findMany({
        where: { id_user_type: userTypeId },
        include: {
          user_type: true,
          permission: true,
        },
      });

      if (rolePermissions.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No role permissions found for user type ID "${userTypeId}".`,
        });
      }

      return rolePermissions.map((rolePermission) =>
        RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
          new RolesPermissionModel(
            rolePermission.id_role_permission,
            new UserTypeModel(
              rolePermission.user_type.id_user_type,
              rolePermission.user_type.name,
              rolePermission.user_type.description,
            ),
            new PermissionModel(
              rolePermission.permission.id_permission,
              rolePermission.permission.name,
              rolePermission.permission.description,
              rolePermission.permission.created_at,
              rolePermission.permission.updated_at,
            ),
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findByPermissionId(
    permissionId: number,
  ): Promise<RolePermissionResponse[]> {
    try {
      const rolePermissions = await this.prismaService.rolePermission.findMany({
        where: { id_permission: permissionId },
        include: {
          user_type: true,
          permission: true,
        },
      });

      if (rolePermissions.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No role permissions found for permission ID "${permissionId}".`,
        });
      }

      return rolePermissions.map((rolePermission) =>
        RolePermissionAdapter.fromRolePermissionModelToRolePermissionResponse(
          new RolesPermissionModel(
            rolePermission.id_role_permission,
            new UserTypeModel(
              rolePermission.user_type.id_user_type,
              rolePermission.user_type.name,
              rolePermission.user_type.description,
            ),
            new PermissionModel(
              rolePermission.permission.id_permission,
              rolePermission.permission.name,
              rolePermission.permission.description,
              rolePermission.permission.created_at,
              rolePermission.permission.updated_at,
            ),
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
