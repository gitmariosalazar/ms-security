import { RoleUserResponse } from '../schemas/dto/response/role-user.response';
import { RoleUserModel } from '../schemas/model/role-users.model';

export interface InterfaceRoleUserRepository {
  create(roleUser: RoleUserModel): Promise<RoleUserResponse | null>;
  findById(idRoleUser: number): Promise<RoleUserResponse | null>;
  findAll(): Promise<RoleUserResponse[]>;
  update(
    idRoleUser: number,
    roleUser: Partial<RoleUserModel>,
  ): Promise<RoleUserResponse | null>;
  delete(idRoleUser: number): Promise<boolean>;
  findByUserIdAndRoleId(
    idUser: string,
    idRole: number,
  ): Promise<RoleUserResponse | null>;
}
