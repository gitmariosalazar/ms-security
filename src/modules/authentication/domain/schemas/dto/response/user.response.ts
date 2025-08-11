import { RoleUserResponse } from 'src/modules/roles/domain/schemas/dto/response/role-user.response';

export interface AuthUserResponse {
  idUser: string;
  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  roleUsers?: RoleUserResponse[];
  createdAt?: Date;
  updatedAt?: Date;
}
