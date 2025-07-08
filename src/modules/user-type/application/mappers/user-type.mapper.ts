import { CreateUserTypeRequest } from '../../domain/schemas/dto/request/create.user-type.request';
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
}
