import { InterfacePermissionRepository } from "src/modules/permission/domain/contracts/permission.repository.interface";
import { PermissionResponse } from "src/modules/permission/domain/schemas/dto/response/permission.response";
import { PermissionModel } from "src/modules/permission/domain/schemas/model/permission.model";
import { PrismaService } from "src/shared/prisma/service/prisma.service";
import { PermissionAdapter } from "../../../adapters/permission.adapter";
import { RpcException } from "@nestjs/microservices";
import { statusCode } from "src/settings/environments/status-code";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionPrismaImplementation implements InterfacePermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(permissionModel: PermissionModel): Promise<PermissionResponse | null> {

    try {
      const permissionFound = await this.prismaService.permission.findFirst({
        where: { name: permissionModel.getName() },
      });
      if (permissionFound) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Permission with name "${permissionModel.getName()}" already exists.`,
        });
      }
      const permission = await this.prismaService.permission.create({
        data: {
          name: permissionModel.getName(),
          description: permissionModel.getDescription(),
        },
      });

      if (!permission) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create permission.',
        });
      }

      return PermissionAdapter.fromPermissionModelToPermissionResponse(
        new PermissionModel(
          permission.id_permission,
          permission.name,
          permission.description,
        ),
      );
    } catch (error) {
      throw error;
      
    }
  }

  async update(idPermission: number, permissionModel: PermissionModel): Promise<PermissionResponse | null> {
    try {
      const permissionFound = await this.prismaService.permission.findUnique({
        where: { id_permission: idPermission },
      });

      if (!permissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Permission with ID ${idPermission} not found.`,
        });
      }

      const updatedPermission = await this.prismaService.permission.update({
        where: { id_permission: idPermission },
        data: {
          name: permissionModel.getName(),
          description: permissionModel.getDescription(),
        },
      });

      return PermissionAdapter.fromPermissionModelToPermissionResponse(
        new PermissionModel(
          updatedPermission.id_permission,
          updatedPermission.name,
          updatedPermission.description,
        ),
      );
    } catch (error) {
      throw error;
      
    }
  }

  async findById(idPermission: number): Promise<PermissionResponse | null> {
    try {
      const permissionFound = await this.prismaService.permission.findUnique({
        where: { id_permission: idPermission },
      });

      if (!permissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Permission with ID ${idPermission} not found.`,
        });
      }

      return PermissionAdapter.fromPermissionModelToPermissionResponse(
        new PermissionModel(
          permissionFound.id_permission,
          permissionFound.name,
          permissionFound.description,
        ),
      );
    } catch (error) {
      throw error;

    }
  }

  async findByName(name: string): Promise<PermissionResponse | null> {
    try {
      const permissionFound = await this.prismaService.permission.findFirst({
        where: { name },
      });

      if (!permissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Permission with name "${name}" not found.`,
        });
      }

      return PermissionAdapter.fromPermissionModelToPermissionResponse(
        new PermissionModel(
          permissionFound.id_permission,
          permissionFound.name,
          permissionFound.description,
        ),
      );
    } catch (error) {
      throw error;

    }
  }

  async findAll(): Promise<PermissionResponse[]> {
    try {
      const permissionsFound = await this.prismaService.permission.findMany();

      if (permissionsFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No permissions found.',
        });
      }

      return permissionsFound.map(permission => 
        PermissionAdapter.fromPermissionModelToPermissionResponse(
          new PermissionModel(
            permission.id_permission,
            permission.name,
            permission.description,
          ),
        ),
      );
    } catch (error) {
      throw error;

    }
  }

  async delete(idPermission: number): Promise<boolean> {
    try {
      const permissionFound = await this.prismaService.permission.findUnique({
        where: { id_permission: idPermission },
      });

      if (!permissionFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Permission with ID ${idPermission} not found.`,
        });
      }

      await this.prismaService.permission.delete({
        where: { id_permission: idPermission },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

}