import { PermissionResponse } from "../../domain/schemas/dto/response/permission.response";
import { PermissionModel } from "../../domain/schemas/model/permission.model";

export class PermissionAdapter {
  static fromPermissionModelToPermissionResponse(permissionModel: PermissionModel): PermissionResponse {
    return {
      idPermission: permissionModel.getIdPermission(),
      name: permissionModel.getName(),
      description: permissionModel.getDescription()
    };
  }
}