import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { UserModel } from '../../domain/schemas/model/user.model';

export class UserAdapter {
  static fromUserModelToUserResponse(userModel: UserModel): UserResponse {
    return {
      idUser: userModel.getIdUser(),
      userEmail: userModel.getUserEmail(),
      firstName: userModel.getFirstName(),
      lastName: userModel.getLastName(),
      userActive: userModel.isUserActive(),
      phoneNumber: userModel.getPhoneNumber(),
      roleUser: userModel.getRoleUser().map((role) => {
        return {
          idRoleUser: role.getIdRoleUser(),
          idUser: role.getUser().getIdUser(),
          idUserType: role.getUserType().getIdUserType(),
          createdAt: role.getCreatedAt(),
          updatedAt: role.getUpdatedAt(),
        };
      }),
      createdAt: userModel.getCreatedAt(),
      updatedAt: userModel.getUpdatedAt(),
    };
  }
}
