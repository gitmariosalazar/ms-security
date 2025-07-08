import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../../application/services/user.service';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { UserPrismaImplementation } from '../repositories/prisma/persistence/prisma.user.persistence';
import { UserTypeMySQLImplementation } from 'src/modules/user-type/infrastructure/repositories/mysql/persistence/mysql.user-type.persistence';
import { UserTypePrismaImplementation } from 'src/modules/user-type/infrastructure/repositories/prisma/persistence/prisma.user-type.persistence';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserPrismaImplementation,
    },
    {
      provide: 'UserTypeRepository',
      useClass: UserTypePrismaImplementation,
    },
  ],
  exports: [],
})
export class UserModuleUsingPrisma {}
