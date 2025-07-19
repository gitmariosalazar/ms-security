import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.use-case.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';
import { User } from '../../domain/schemas/dto/response/user.auth.response';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'Sign in a user using credentials (Email and Password) ✅',
    description:
      'This endpoint allows a user to sign in using their credentials.',
  })
  @MessagePattern('auth.signin')
  async signin(
    @Payload() signInRequest: SignInRequest,
  ): Promise<TokenResponse | null> {
    return this.authService.signin(signInRequest);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Sign up a new user ✅',
    description:
      'This endpoint allows a new user to sign up and create an account.',
  })
  @MessagePattern('auth.signup')
  async signup(
    @Payload() signUpRequest: SignUpRequest,
  ): Promise<TokenResponse | null> {
    return this.authService.signup(signUpRequest);
  }

  @Get('verify-token')
  @ApiOperation({
    summary: 'Verify a JWT token ✅',
    description:
      'This endpoint verifies the provided JWT token and returns its validity status.',
  })
  @MessagePattern('auth.verify-token')
  async verifyToken(
    @Payload('auth_token') auth_token: string,
  ): Promise<boolean> {
    return this.authService.verifyToken(auth_token);
  }

  @Get('find-user-by-email')
  @ApiOperation({
    summary: 'Find user by email ✅',
    description: 'This endpoint retrieves a user by their email address.',
  })
  @MessagePattern('auth.findUserByEmail')
  async findUserByEmail(
    @Payload('userEmail') userEmail: string,
  ): Promise<AuthUserResponse | null> {
    return this.authService.findUserByEmail(userEmail);
  }

  @Get('current-user')
  @ApiOperation({
    summary: 'Get current authenticated user ✅',
    description:
      'This endpoint retrieves the current authenticated user based on the provided JWT token.',
  })
  @MessagePattern('auth.currentUser')
  async getCurrentUser(
    @Payload('auth_token') auth_token: string,
  ): Promise<User | null> {
    return this.authService.getCurrentUser(auth_token);
  }
}
