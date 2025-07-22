import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.use-case.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';
import { User } from '../../domain/schemas/dto/response/user.auth.response';
import { VerifyTokenRequest } from '../../domain/schemas/dto/request/verify-token.request';
import { SessionResponse } from '../../domain/schemas/dto/response/session.response';
import { RefreshTokenResponse } from '../../domain/schemas/dto/response/refresh-token.response';

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
    @Payload('verifyToken') verifyToken: VerifyTokenRequest,
  ): Promise<SessionResponse | null> {
    return this.authService.verifyToken(verifyToken);
  }

  @Get('get-session')
  @ApiOperation({
    summary: 'Get session information from a JWT token ✅',
    description:
      'This endpoint retrieves session information from the provided JWT token.',
  })
  @MessagePattern('auth.get-session')
  async getSession(
    @Payload('verifyToken') verifyToken: VerifyTokenRequest,
  ): Promise<SessionResponse | null> {
    return this.authService.getSession(verifyToken);
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

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh an access token using a refresh token ✅',
    description:
      'This endpoint allows a user to refresh their access token by providing a valid refresh token.',
  })
  @MessagePattern('auth.refresh-token')
  async refreshToken(
    @Payload('refreshToken') refreshToken: string,
  ): Promise<RefreshTokenResponse | null> {
    return this.authService.refreshToken(refreshToken);
  }
}
