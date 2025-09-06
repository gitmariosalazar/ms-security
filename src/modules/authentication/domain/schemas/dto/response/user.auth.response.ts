import { RoleUserResponse } from 'src/modules/roles/domain/schemas/dto/response/role-user.response';

export interface User {
  idUser: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  phoneNumber: string;
  roleUsers: RoleUserResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}
