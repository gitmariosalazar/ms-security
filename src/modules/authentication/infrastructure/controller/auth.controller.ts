import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.use-case.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';

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
}
