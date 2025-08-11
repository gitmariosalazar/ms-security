import { CreateUserTypeRequest } from '../../domain/schemas/dto/request/create.user-type.request';
import { UserTypeResponse } from '../../domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from '../../domain/schemas/model/user-type.model';

export class UserTypeMapper {
  /**
   * Maps a UserTypeRequest to a UserTypeModel.
   * @param {CreateUserTypeRequest} userTypeRequest - The user type request to map.
   * @returns {UserTypeModel} The mapped user type model.
   */
  static fromUserTypeRequestToUserTypeModel(
    userTypeRequest: CreateUserTypeRequest,
  ): UserTypeModel {
    return new UserTypeModel(
      1,
      userTypeRequest.name,
      userTypeRequest.description,
    );
  }

  static fromUserTypeResponseToUserTypeModel(
    userTypeResponse: UserTypeResponse,
  ): UserTypeModel {
    return new UserTypeModel(
      userTypeResponse.idUserType,
      userTypeResponse.name,
      userTypeResponse.description,
    );
  }
}
