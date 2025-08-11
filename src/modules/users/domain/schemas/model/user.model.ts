import { RoleUserModel } from 'src/modules/roles/domain/schemas/model/role-users.model';

export class UserModel {
  private idUser: string;
  private userEmail: string;
  private userPassword: string;
  private firstName: string;
  private lastName: string;
  private userActive: boolean;
  private roleUser: RoleUserModel[] | null;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idUser: string,
    userEmail: string,
    userPassword: string,
    firstName: string,
    lastName: string,
    userActive: boolean,
    roleUser: RoleUserModel[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.idUser = idUser;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userActive = userActive;
    this.roleUser = roleUser;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getRoleUser(): RoleUserModel[] {
    return this.roleUser;
  }

  public setRoleUser(roleUser: RoleUserModel[]): void {
    this.roleUser = roleUser;
  }
  getIdUser(): string {
    return this.idUser;
  }
  getUserEmail(): string {
    return this.userEmail;
  }
  getUserPassword(): string {
    return this.userPassword;
  }
  getFirstName(): string {
    return this.firstName;
  }
  getLastName(): string {
    return this.lastName;
  }
  isUserActive(): boolean {
    return this.userActive;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setIdUser(idUser: string): void {
    this.idUser = idUser;
  }
  setUserEmail(userEmail: string): void {
    this.userEmail = userEmail;
  }
  setUserPassword(userPassword: string): void {
    this.userPassword = userPassword;
  }
  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }
  setLastName(lastName: string): void {
    this.lastName = lastName;
  }
  setUserActive(userActive: boolean): void {
    this.userActive = userActive;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
  toJSON(): object {
    return {
      idUser: this.idUser,
      userEmail: this.userEmail,
      userPassword: this.userPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      userActive: this.userActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
