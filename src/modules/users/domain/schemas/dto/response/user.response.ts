import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';

export interface UserResponse {
  idUser: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  userType: UserTypeResponse;
  createdAt: Date;
  updatedAt: Date;
}
