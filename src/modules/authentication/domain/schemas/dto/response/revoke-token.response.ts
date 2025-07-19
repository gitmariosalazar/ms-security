export interface RevokeTokenResponse {
  idRevokeToken: string;
  idAccessToken: string;
  idUser: string;
  reason: string;
  jti: string;
  createdAt?: Date;
  updatedAt?: Date;
}
