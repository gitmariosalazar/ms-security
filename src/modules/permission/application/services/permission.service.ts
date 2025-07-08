import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUseCadePermission } from '../usecases/permission.use-case.interface';
import { InterfacePermissionRepository } from '../../domain/contracts/permission.repository.interface';
import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { PermissionMapper } from '../mapper/permission.mapper';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';

@Injectable()
export class PermissionService implements InterfaceUseCadePermission {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: InterfacePermissionRepository,
  ) {}

  async create(
    permissionRequest: CreatePermissionRequest,
  ): Promise<PermissionResponse | null> {
    const requiredFields: string[] = ['name', 'description'];
    const missingFieldsMessages: string[] = validateFields(
      permissionRequest,
      requiredFields,
    );
    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }

    const permissionModel =
      PermissionMapper.fromCreatePermisionRequestToPermissionModel(permissionRequest);
    return this.permissionRepository.create(permissionModel);
  }

  async update(
    idPermission: number,
    permissionRequest: UpdatePermissionRequest,
  ): Promise<PermissionResponse | null> {
    if (!idPermission || isNaN(idPermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to update a permission.',
      });
    }

    const requiredFields: string[] = ['name', 'description'];
    const missingFieldsMessages: string[] = validateFields(
      permissionRequest,
      requiredFields,
    );
    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }

    const permissionModel =
      PermissionMapper.fromUpdatePermisionRequestToPermissionModel(permissionRequest);
    return this.permissionRepository.update(idPermission, permissionModel);
  }

  async findById(idPermission: number): Promise<PermissionResponse | null> {
    if (!idPermission || isNaN(idPermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to find a permission.',
      });
    }
    return this.permissionRepository.findById(idPermission);
  }

  async findByName(name: string): Promise<PermissionResponse | null> {
    if (!name || name.trim() === '') {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Name is required to find a permission.',
      });
    }
    return this.permissionRepository.findByName(name);
  }

  async findAll(): Promise<PermissionResponse[]> {
    return this.permissionRepository.findAll();
  }

  async delete(idPermission: number): Promise<boolean> {
    if (!idPermission || isNaN(idPermission)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to delete a permission.',
      });
    }
    return this.permissionRepository.delete(idPermission);
  }
}
