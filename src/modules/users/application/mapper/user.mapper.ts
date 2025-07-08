import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserModel } from '../../domain/schemas/model/user.model';

export class UserMapper {
  static fromCreateUserRequestToUserModel(
    userRequest: CreateUserRequest,
    userTypeModel: UserTypeModel,
  ): UserModel {
    return new UserModel(
      1,
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      userTypeModel,
    );
  }

  static fromUpdateUserRequestToUserModel(
    userRequest: CreateUserRequest,
    userTypeModel: UserTypeModel,
  ): UserModel {
    return new UserModel(
      1,
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      userTypeModel,
    );
  }
}
