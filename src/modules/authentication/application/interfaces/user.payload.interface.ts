export interface IUserPayload {
  idUser: number;
  userEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  date: Date;
  userType: string;
}