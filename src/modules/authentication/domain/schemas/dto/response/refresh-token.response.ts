export interface RefreshTokenResponse {
  idRefreshToken: string;
  idUser: string;
  idAccessToken: string;
  refreshToken: string;
  revoked: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
