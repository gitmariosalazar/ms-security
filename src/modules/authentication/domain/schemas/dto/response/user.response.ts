export interface AuthUserResponse {
  idUser: number;
  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  userActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}