import { CreateRolePermissionRequest } from '../../domain/schemas/dto/request/create.role-permission.request';
import { UpdateRolePermissionRequest } from '../../domain/schemas/dto/request/update.role-permission.request';
import { RolePermissionResponse } from '../../domain/schemas/dto/response/role-permission.response';

export interface InterfaceRolePermissionUseCase {
  createRolePermission(
    rolePermissionRequest: CreateRolePermissionRequest,
  ): Promise<RolePermissionResponse>;
  updateRolePermission(
    idRolePermission: number,
    rolePermissionRequest: UpdateRolePermissionRequest,
  ): Promise<RolePermissionResponse | null>;
  deleteRolePermission(idRolePermission: number): Promise<boolean>;
  findAllRolePermissions(): Promise<RolePermissionResponse[]>;
  findRolePermissionById(
    idRolePermission: number,
  ): Promise<RolePermissionResponse | null>;
  findRolePermissionsByUserTypeId(
    userTypeId: number,
  ): Promise<RolePermissionResponse[]>;
  findRolePermissionsByPermissionId(
    permissionId: number,
  ): Promise<RolePermissionResponse[]>;
}
