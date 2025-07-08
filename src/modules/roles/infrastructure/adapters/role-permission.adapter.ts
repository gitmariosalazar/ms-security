import { UserTypeAdapter } from "src/modules/user-type/infrastructure/adapters/user-type.adapter";
import { RolePermissionResponse } from "../../domain/schemas/dto/response/role-permission.response";
import { RolesPermissionModel } from "../../domain/schemas/model/role-permission.model";
import { PermissionAdapter } from "src/modules/permission/infrastructure/adapters/permission.adapter";

export class RolePermissionAdapter {
  static fromRolePermissionModelToRolePermissionResponse(
    rolePermissionModel: RolesPermissionModel,
  ): RolePermissionResponse {
    const rolePermissionResponse: RolePermissionResponse = {
      idRolePermission: rolePermissionModel.getIdRolePermission(),
      userType: UserTypeAdapter.fromUserTypeModelToUserTypeResponse(
        rolePermissionModel.getUserType()),
      permission: PermissionAdapter.fromPermissionModelToPermissionResponse(
        rolePermissionModel.getPermission()),
    };
    return rolePermissionResponse;
  }
}