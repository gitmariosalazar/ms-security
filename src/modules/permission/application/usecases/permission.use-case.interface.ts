import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';
import { PermissionResponse } from '../../domain/schemas/dto/response/permission.response';

export interface InterfaceUseCadePermission {
  create(
    permissionRequest: CreatePermissionRequest,
  ): Promise<PermissionResponse | null>;
  update(
    idPermission: number,
    permissionRequest: UpdatePermissionRequest,
  ): Promise<PermissionResponse | null>;
  findById(idPermission: number): Promise<PermissionResponse | null>;
  findByName(name: string): Promise<PermissionResponse | null>;
  findAll(): Promise<PermissionResponse[]>;
  delete(idPermission: number): Promise<boolean>;
}
