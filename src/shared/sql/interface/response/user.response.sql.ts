export interface UserResponseSql {
  idUser: number;
  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  idUserType: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}