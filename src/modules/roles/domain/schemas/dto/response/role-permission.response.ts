import { PermissionResponse } from "src/modules/permission/domain/schemas/dto/response/permission.response";
import { UserTypeResponse } from "src/modules/user-type/domain/schemas/dto/response/user-type.response";

export interface RolePermissionResponse {
  idRolePermission: number;
  userType: UserTypeResponse;
  permission: PermissionResponse;
  createdAt?: Date;
  updatedAt?: Date;
}