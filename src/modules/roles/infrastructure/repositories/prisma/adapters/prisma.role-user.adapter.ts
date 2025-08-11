import { RoleUser } from '@prisma/client';
import { RoleUserResponse } from 'src/modules/roles/domain/schemas/dto/response/role-user.response';

export class RoleUserAdapter {
  static fromRoleUserPrismaToRoleUserResponse(
    roleUser: RoleUser,
  ): RoleUserResponse {
    return {
      idRoleUser: roleUser.idRoleUser,
      idUser: roleUser.id_user,
      idUserType: roleUser.id_user_type,
      createdAt: roleUser.created_at,
      updatedAt: roleUser.updated_at,
    };
  }
}
