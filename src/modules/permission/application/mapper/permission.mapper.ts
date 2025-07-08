import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';
import { PermissionModel } from '../../domain/schemas/model/permission.model';

export class PermissionMapper {
  static fromCreatePermisionRequestToPermissionModel(
    permissionRequest: CreatePermissionRequest,
  ): PermissionModel {
    return new PermissionModel(
      1,
      permissionRequest.name,
      permissionRequest.description,
    );
  }

  static fromUpdatePermisionRequestToPermissionModel(
    permissionRequest: UpdatePermissionRequest,
  ): PermissionModel {
    return new PermissionModel(
      1,
      permissionRequest.name,
      permissionRequest.description,
    );
  }
}
