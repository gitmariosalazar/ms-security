import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRolePermissionUseCase } from '../usecases/role-permission.use-case.interface';
import { InterfaceRolePermissionRepository } from '../../domain/contracts/role-permission.repository.interface';
import { CreateRolePermissionRequest } from '../../domain/schemas/dto/request/create.role-permission.request';
import { RolePermissionResponse } from '../../domain/schemas/dto/response/role-permission.response';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { RolePermissionMapper } from '../mapper/role-permission.mapper';
import { UpdateRolePermissionRequest } from '../../domain/schemas/dto/request/update.role-permission.request';
import { InterfacePermissionRepository } from 'src/modules/permission/domain/contracts/permission.repository.interface';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { PermissionModel } from 'src/modules/permission/domain/schemas/model/permission.model';

@Injectable()
export class RolePermissionService implements InterfaceRolePermissionUseCase {
  constructor(
    @Inject(`RolePermissionRepository`)
    private readonly rolePermissionRepository: InterfaceRolePermissionRepository,

    @Inject(`PermissionRepository`)
    private readonly permissionRepository: InterfacePermissionRepository,

    @Inject(`UserTypeRepository`)
    private readonly userTypeRepository: InterfaceUserTypeRepository,
  ) {}

  async createRolePermission(
    rolePermissionRequest: CreateRolePermissionRequest,
  ): Promise<RolePermissionResponse> {
    const requiredFields: string[] = ['userTypeId', 'permissionId'];
    const missingFieldsMessages: string[] = validateFields(
      rolePermissionRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }

    const userTypeFound: UserTypeResponse = await this.userTypeRepository.findById(
      rolePermissionRequest.userTypeId,
    );

    if (!userTypeFound) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `User type with ID ${rolePermissionRequest.userTypeId} not found.`,
      });
    }

    const permissionFound = await this.permissionRepository.findById(
      rolePermissionRequest.permissionId,
    );

    if (!permissionFound) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `Permission with ID ${rolePermissionRequest.permissionId} not found.`,
      });
    }

    const userTypeModel: UserTypeModel = new UserTypeModel(
      userTypeFound.idUserType,
      userTypeFound.name,
      userTypeFound.description,)
    
    const permissionModel: PermissionModel = new PermissionModel(
      permissionFound.idPermission,
      permissionFound.name,
      permissionFound.description,
    );

    const rolePermissionModel = RolePermissionMapper.fromCreateRolePermissionRequestToRolePermissionModel(

      rolePermissionRequest,
      userTypeModel,
      permissionModel,
    );

    return this.rolePermissionRepository.create(rolePermissionModel);
  }

  async updateRolePermission(
    idRolePermission: number,
    rolePermissionRequest: UpdateRolePermissionRequest,
  ): Promise<RolePermissionResponse | null> {
    if (!idRolePermission || isNaN(idRolePermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to update a role permission.',
      });
    }

    const requiredFields: string[] = ['userTypeId', 'permissionId'];
    const missingFieldsMessages: string[] = validateFields(
      rolePermissionRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }


    const userTypeFound: UserTypeResponse =
      await this.userTypeRepository.findById(rolePermissionRequest.userTypeId);

    if (!userTypeFound) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `User type with ID ${rolePermissionRequest.userTypeId} not found.`,
      });
    }

    const permissionFound = await this.permissionRepository.findById(
      rolePermissionRequest.permissionId,
    );

    if (!permissionFound) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `Permission with ID ${rolePermissionRequest.permissionId} not found.`,
      });
    }

    const userTypeModel: UserTypeModel = new UserTypeModel(
      userTypeFound.idUserType,
      userTypeFound.name,
      userTypeFound.description,
    );

    const permissionModel: PermissionModel = new PermissionModel(
      permissionFound.idPermission,
      permissionFound.name,
      permissionFound.description,
    );

    const rolePermissionModel = RolePermissionMapper.fromUpdateRolePermissionRequestToRolePermissionModel(
      rolePermissionRequest,
      userTypeModel,
      permissionModel,
    );

    return this.rolePermissionRepository.update(
      idRolePermission,
      rolePermissionModel,
    );
  }

  async deleteRolePermission(idRolePermission: number): Promise<boolean> {
    if (!idRolePermission || isNaN(idRolePermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to delete a role permission.',
      });
    }
    return this.rolePermissionRepository.delete(idRolePermission);
  }

  async findAllRolePermissions(): Promise<RolePermissionResponse[]> {
    return this.rolePermissionRepository.findAll();
  }

  async findRolePermissionById(
    idRolePermission: number,
  ): Promise<RolePermissionResponse | null> {
    if (!idRolePermission || isNaN(idRolePermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to find a role permission.',
      });
    }
    return this.rolePermissionRepository.findById(idRolePermission);
  }

  async findRolePermissionsByUserTypeId(
    userTypeId: number,
  ): Promise<RolePermissionResponse[]> {
    if (!userTypeId || isNaN(userTypeId)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'User Type ID is required to find role permissions.',
      });
    }
    return this.rolePermissionRepository.findByUserTypeId(userTypeId);
  }

  async findRolePermissionsByPermissionId(
    permissionId: number,
  ): Promise<RolePermissionResponse[]> {
    if (!permissionId || isNaN(permissionId)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Permission ID is required to find role permissions.',
      });
    }
    return this.rolePermissionRepository.findByPermissionId(permissionId);
  }
}
