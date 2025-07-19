export class RevokeTokenModel {
  private idRevokeToken: string;
  private idAccessToken: string;
  private jti: string;
  private reason?: string;
  private idUser?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idRevokeToken: string,
    idAccessToken: string,
    jti: string,
    reason?: string,
    idUser?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.idRevokeToken = idRevokeToken;
    this.idAccessToken = idAccessToken;
    this.jti = jti;
    this.reason = reason;
    this.idUser = idUser;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getIdRevokeToken(): string {
    return this.idRevokeToken;
  }

  getIdAccessToken(): string {
    return this.idAccessToken;
  }

  getReason(): string | undefined {
    return this.reason;
  }

  getIdUser(): string | undefined {
    return this.idUser;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setIdRevokeToken(idRevokeToken: string): void {
    this.idRevokeToken = idRevokeToken;
  }

  setIdAccessToken(idAccessToken: string): void {
    this.idAccessToken = idAccessToken;
  }

  setJti(jti: string): void {
    this.jti = jti;
  }

  getJti(): string {
    return this.jti;
  }

  setReason(reason: string): void {
    this.reason = reason;
  }

  setIdUser(idUser: string): void {
    this.idUser = idUser;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
