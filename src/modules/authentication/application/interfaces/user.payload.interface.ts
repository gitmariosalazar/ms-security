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
  iat?: number; // Issued at time
  exp?: number; // Expiration time
}

export interface IRefreshTokenPayload {
  idUser: string;
  idAccessToken: string;
  iat: number; // Issued at time
  exp: number; // Expiration time
}
