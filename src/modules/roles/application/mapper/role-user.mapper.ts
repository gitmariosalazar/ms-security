import { UserModel } from 'src/modules/users/domain/schemas/model/user.model';
import { CreateRoleUserRequest } from '../../domain/schemas/dto/request/create.role-user.request';
import { RoleUserModel } from '../../domain/schemas/model/role-users.model';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { UpdateRoleUserRequest } from '../../domain/schemas/dto/request/update.role-user.request';

export class RoleUserMapper {
  static fromCreateRoleUserRequestToRoleUserModel(
    roleUserRequest: CreateRoleUserRequest,
    userModel: UserModel,
    userTypeModel: UserTypeModel,
  ): RoleUserModel {
    const roleUser = new RoleUserModel(0, userTypeModel, userModel);
    return roleUser;
  }

  static fromUpdateRoleUserRequestToRoleUserModel(
    roleUserRequest: UpdateRoleUserRequest,
    userModel: UserModel,
    userTypeModel: UserTypeModel,
  ): RoleUserModel {
    const roleUser = new RoleUserModel(0, userTypeModel, userModel);
    return roleUser;
  }
}
