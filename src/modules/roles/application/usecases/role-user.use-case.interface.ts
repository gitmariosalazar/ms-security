import { CreateRoleUserRequest } from '../../domain/schemas/dto/request/create.role-user.request';
import { UpdateRoleUserRequest } from '../../domain/schemas/dto/request/update.role-user.request';
import { RoleUserResponse } from '../../domain/schemas/dto/response/role-user.response';

export interface InterfaceRoleUserUseCase {
  createRoleUser(
    roleUser: CreateRoleUserRequest,
  ): Promise<RoleUserResponse | null>;
  updateRoleUser(
    idRoleUser: number,
    roleUser: UpdateRoleUserRequest,
  ): Promise<RoleUserResponse | null>;
  findRoleUserById(idRoleUser: number): Promise<RoleUserResponse | null>;
  findAllRoleUsers(): Promise<RoleUserResponse[]>;
  deleteRoleUser(idRoleUser: number): Promise<boolean>;
  findRoleUserByUserIdAndRoleId(
    idUser: string,
    idRole: number,
  ): Promise<RoleUserResponse | null>;
}
