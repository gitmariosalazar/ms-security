import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { AuthService } from '../../application/services/auth.use-case.service';
import { AuthPrismaImplementation } from '../repositories/prisma/persistence/prisma.auth.persistence';
import { UserPrismaImplementation } from 'src/modules/users/infrastructure/repositories/prisma/persistence/prisma.user.persistence';
import { JwtModule } from '@nestjs/jwt';
import { environments } from 'src/settings/environments/environments';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: environments.secretKey,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    {
      provide: 'AuthRepository',
      useClass: AuthPrismaImplementation,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaImplementation,
    },
  ],
  exports: [],
})
export class AuthModuleUsingPrisma {}
