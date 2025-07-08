import { PermissionModel } from "src/modules/permission/domain/schemas/model/permission.model";
import { UserTypeModel } from "src/modules/user-type/domain/schemas/model/user-type.model";

export class RolesPermissionModel{
  private idRolePermission: number;
  private userType: UserTypeModel
  private permission: PermissionModel
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idRolePermission: number,
    userType: UserTypeModel,
    permission: PermissionModel,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.idRolePermission = idRolePermission;
    this.userType = userType;
    this.permission = permission;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getIdRolePermission(): number {
    return this.idRolePermission;
  }

  getUserType(): UserTypeModel {
    return this.userType;
  }

  getPermission(): PermissionModel {
    return this.permission;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setIdRolePermission(idRolePermission: number): void {
    this.idRolePermission = idRolePermission;
  }

  setUserType(userType: UserTypeModel): void {
    this.userType = userType;
  }

  setPermission(permission: PermissionModel): void {
    this.permission = permission;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}