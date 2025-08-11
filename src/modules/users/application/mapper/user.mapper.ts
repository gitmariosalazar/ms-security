import { RoleUserResponse } from './../../../roles/domain/schemas/dto/response/role-user.response';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserModel } from '../../domain/schemas/model/user.model';
import { v4 as uuid } from 'uuid';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { RoleUserModel } from 'src/modules/roles/domain/schemas/model/role-users.model';

export class UserMapper {
  static fromCreateUserRequestToUserModel(
    userRequest: CreateUserRequest,
  ): UserModel {
    return new UserModel(
      uuid(),
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      null,
    );
  }

  static fromUpdateUserRequestToUserModel(
    userRequest: CreateUserRequest,
  ): UserModel {
    return new UserModel(
      uuid(),
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      null,
    );
  }

  static fromUserResponseToUserModel(userResponse: UserResponse): UserModel {
    return new UserModel(
      userResponse.idUser,
      userResponse.userEmail,
      '',
      userResponse.firstName,
      userResponse.lastName,
      userResponse.userActive,
      null,
    );
  }
}
