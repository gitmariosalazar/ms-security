import { RolePermissionResponse } from '../schemas/dto/response/role-permission.response';
import { RolesPermissionModel } from '../schemas/model/role-permission.model';

export interface InterfaceRolePermissionRepository {
  create(
    rolePermissionRequest: RolesPermissionModel,
  ): Promise<RolePermissionResponse | null>;
  update(
    idRolePermission: number,
    rolePermissioRequest: RolesPermissionModel,
  ): Promise<RolePermissionResponse | null>;
  delete(idRolePermission: number): Promise<boolean>;
  findAll(): Promise<RolePermissionResponse[]>;
  findById(idRolePermission: number): Promise<RolePermissionResponse | null>;
  findByUserTypeId(userTypeId: number): Promise<RolePermissionResponse[]>;
  findByPermissionId(permissionId: number): Promise<RolePermissionResponse[]>;
}
