export class RefreshTokenModel {
  private idRefreshToken: string;
  private idUser: string;
  private idAccessToken: string;
  private refreshToken: string;
  private revoked: boolean;
  private expiresAt: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idRefreshToken: string,
    idUser: string,
    idAccessToken: string,
    refreshToken: string,
    revoked: boolean,
    expiresAt: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.idRefreshToken = idRefreshToken;
    this.idUser = idUser;
    this.idAccessToken = idAccessToken;
    this.refreshToken = refreshToken;
    this.revoked = revoked;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getIdRefreshToken(): string {
    return this.idRefreshToken;
  }

  getIdUser(): string {
    return this.idUser;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  isRevoked(): boolean {
    return this.revoked;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setRevoked(revoked: boolean): void {
    this.revoked = revoked;
  }

  setExpiresAt(expiresAt: Date): void {
    this.expiresAt = expiresAt;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  setIdRefreshToken(idRefreshToken: string): void {
    this.idRefreshToken = idRefreshToken;
  }

  setIdUser(idUser: string): void {
    this.idUser = idUser;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  getIdAccessToken(): string {
    return this.idAccessToken;
  }

  setIdAccessToken(idAccessToken: string): void {
    this.idAccessToken = idAccessToken;
  }

  toJSON(): object {
    return {
      idRefreshToken: this.idRefreshToken,
      idUser: this.idUser,
      refreshToken: this.refreshToken,
      revoked: this.revoked,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
