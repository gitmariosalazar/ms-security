import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../../application/services/user.service';
import { DatabaseServiceMySQL } from 'src/shared/connections/database/mysql/mysql.service';
import { UserMySQLImplementation } from '../repositories/mysql/persistence/mysql.user.persistence';
import { UserTypeMySQLImplementation } from 'src/modules/user-type/infrastructure/repositories/mysql/persistence/mysql.user-type.persistence';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    DatabaseServiceMySQL,
    {
      provide: 'UserRepository',
      useClass: UserMySQLImplementation,
    },
    {
      provide: 'UserTypeRepository',
      useClass: UserTypeMySQLImplementation,
    },
  ],
  exports: [],
})
export class UserModuleUsingMySQL {}
