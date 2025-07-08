import { Module } from '@nestjs/common';
import { AuthModuleUsingPrisma } from 'src/modules/authentication/infrastructure/modules/prisma.auth.module';
import { PermissionModuleUsingPrisma } from 'src/modules/permission/infrastructure/modules/prisma.permission.module';
import { RolePermissionModuleUsingPrisma } from 'src/modules/roles/infrastructure/modules/role-permission.prisma.module';
import { UserTypeModuleUsingPrisma } from 'src/modules/user-type/infrastructure/module/user-type.prisma.module';
import { UserModuleUsingPrisma } from 'src/modules/users/infrastructure/module/user.prisma.module';

@Module({
  imports: [
    UserModuleUsingPrisma,
    UserTypeModuleUsingPrisma,
    AuthModuleUsingPrisma,
    PermissionModuleUsingPrisma,
    RolePermissionModuleUsingPrisma,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ModulesUsingPrismaModule {}
