import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { UserModel } from 'src/modules/users/domain/schemas/model/user.model';

export class RoleUserModel {
  private idRoleUser: number;
  private userType: UserTypeModel;
  private user: UserModel;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(idRoleUser: number, userType: UserTypeModel, user: UserModel) {
    this.idRoleUser = idRoleUser;
    this.userType = userType;
    this.user = user;
  }

  public getIdRoleUser(): number {
    return this.idRoleUser;
  }

  public setIdRoleUser(idRoleUser: number): void {
    this.idRoleUser = idRoleUser;
  }

  public getUserType(): UserTypeModel {
    return this.userType;
  }

  public setUserType(userType: UserTypeModel): void {
    this.userType = userType;
  }

  public getUser(): UserModel {
    return this.user;
  }

  public setUser(user: UserModel): void {
    this.user = user;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
