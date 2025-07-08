import { UserTypeResponse } from '../../domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from '../../domain/schemas/model/user-type.model';

export class UserTypeAdapter {
  /**
   * Converts a UserTypeModel to a UserTypeResponse.
   * @param {UserTypeModel} userTypeModel - The user type model to convert.
   * @returns {UserTypeResponse} The converted user type response.
   */
  static fromUserTypeModelToUserTypeResponse(
    userTypeModel: UserTypeModel,
  ): UserTypeResponse {
    return {
      idUserType: userTypeModel.getIdUserType(),
      name: userTypeModel.getName(),
      description: userTypeModel.getDescription(),
      createdAt: userTypeModel.getCreatedAt(),
      updatedAt: userTypeModel.getUpdatedAt(),
    };
  }
}
