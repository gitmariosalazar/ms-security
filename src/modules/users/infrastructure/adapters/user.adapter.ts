import { UserResponse } from "../../domain/schemas/dto/response/user.response";
import { UserModel } from "../../domain/schemas/model/user.model";

export class UserAdapter{
    static fromUserModelToUserResponse(userModel: UserModel): UserResponse {
      return {
        idUser: userModel.getIdUser(),
        userEmail: userModel.getUserEmail(),
        firstName: userModel.getFirstName(),
        lastName: userModel.getLastName(),
        userActive: userModel.isUserActive(),
        userType: {
          idUserType: userModel.getUserType().getIdUserType(),
          name: userModel.getUserType().getName(),
          description: userModel.getUserType().getDescription()
        },
        createdAt: userModel.getCreatedAt(),
        updatedAt: userModel.getUpdatedAt()
      };
    }
}