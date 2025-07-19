export interface AuthUserResponse {
  idUser: string;
  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  userType?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
