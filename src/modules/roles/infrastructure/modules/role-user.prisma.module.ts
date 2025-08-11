import { Module } from '@nestjs/common';
import { RoleUserController } from '../controller/role-user.controller';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { RoleUserService } from '../../application/services/role-user.service';
import { RoleUserPrismaImplementation } from '../repositories/prisma/persistence/prisma.role-user.persistence';
import { UserPrismaImplementation } from 'src/modules/users/infrastructure/repositories/prisma/persistence/prisma.user.persistence';
import { UserTypePrismaImplementation } from 'src/modules/user-type/infrastructure/repositories/prisma/persistence/prisma.user-type.persistence';

@Module({
  imports: [],
  controllers: [RoleUserController],
  providers: [
    PrismaService,
    RoleUserService,
    {
      provide: 'RoleUserRepository',
      useClass: RoleUserPrismaImplementation,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaImplementation,
    },
    {
      provide: 'UserTypeRepository',
      useClass: UserTypePrismaImplementation,
    },
  ],
})
export class RoleUserModuleUsingPrisma {}
