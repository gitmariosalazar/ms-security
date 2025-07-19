export interface IUserPayload {
  idUser: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  date: Date;
  userType: string;
  jti: string; // JWT ID
}
