import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MainModule } from './app/module/app.module';
import { UserTypeModuleUsingPrisma } from './modules/user-type/infrastructure/module/user-type.prisma.module';
import { UserTypeModuleUsingMySQL } from './modules/user-type/infrastructure/module/user-type.mysql.module';
import { UserModuleUsingPrisma } from './modules/users/infrastructure/module/user.prisma.module';
import { UserModuleUsingMySQL } from './modules/users/infrastructure/module/user.mysql.module';
import { PermissionModuleUsingPrisma } from './modules/permission/infrastructure/modules/prisma.permission.module';
import { RolePermissionModuleUsingPrisma } from './modules/roles/infrastructure/modules/role-permission.prisma.module';
import { AuthModuleUsingPrisma } from './modules/authentication/infrastructure/modules/prisma.auth.module';
import { ModulesUsingPrismaModule } from './factory/prisma/modules-using-prisma.module';

@Module({
  imports: [MainModule, ModulesUsingPrismaModule],
})
export class AppModule {}
