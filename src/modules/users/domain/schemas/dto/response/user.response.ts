import { RoleUserResponse } from 'src/modules/roles/domain/schemas/dto/response/role-user.response';

export interface UserResponse {
  idUser: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  phoneNumber: string;
  roleUser: RoleUserResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}
