import { UserTypeMapper } from 'src/modules/user-type/application/mappers/user-type.mapper';
import { CreateRolePermissionRequest } from '../../domain/schemas/dto/request/create.role-permission.request';
import { RolesPermissionModel } from '../../domain/schemas/model/role-permission.model';
import { PermissionMapper } from 'src/modules/permission/application/mapper/permission.mapper';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { PermissionModel } from 'src/modules/permission/domain/schemas/model/permission.model';

export class RolePermissionMapper {
  static fromCreateRolePermissionRequestToRolePermissionModel(
    rolePermissionRequest: CreateRolePermissionRequest,
    userType: UserTypeModel,
    permission: PermissionModel,
  ): RolesPermissionModel {
    return new RolesPermissionModel(1, userType, permission);
  }

  static fromUpdateRolePermissionRequestToRolePermissionModel(
    rolePermissionRequest: CreateRolePermissionRequest,
    userType: UserTypeModel,
    permission: PermissionModel,
  ): RolesPermissionModel {
    return new RolesPermissionModel(1, userType, permission);
  }
}
