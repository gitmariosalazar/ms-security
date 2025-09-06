import { Prisma } from '@prisma/client';
import { UserResponse } from 'src/modules/users/domain/schemas/dto/response/user.response';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    roleUsers: true;
  };
}>;

export class UserPrismaAdapter {
  static fromPrismaToUserResponse(user: UserWithRelations): UserResponse {
    return {
      idUser: user.id_user,
      userEmail: user.user_email,
      firstName: user.first_name,
      lastName: user.last_name,
      userActive: user.user_active,
      phoneNumber: user.phone_number,
      roleUser:
        user.roleUsers?.map((role: any) => {
          return {
            idRoleUser: role.idRoleUser,
            idUser: role.id_user,
            idUserType: role.id_user_type,
            createdAt: role.created_at,
            updatedAt: role.updated_at,
          };
        }) ?? [],
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
