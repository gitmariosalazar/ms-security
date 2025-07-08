import { PermissionResponse } from "../schemas/dto/response/permission.response";
import { PermissionModel } from "../schemas/model/permission.model";

export interface InterfacePermissionRepository{
  create(permissionModel: PermissionModel): Promise<PermissionResponse | null>;
  update(idPermission: number, permissionModel: PermissionModel): Promise<PermissionResponse | null>;
  findById(idPermission: number): Promise<PermissionResponse | null>;
  findByName(name: string): Promise<PermissionResponse | null>;
  findAll(): Promise<PermissionResponse[]>;
  delete(idPermission: number): Promise<boolean>;
}