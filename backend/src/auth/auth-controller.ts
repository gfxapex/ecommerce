import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth-service';
import { SignupDto } from '../dto/auth/signup-dto';
import { AuthResponseDto } from '../dto/auth/auth-response-dto';
import { GetUser } from '../common/decorator/get-user-decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';
import { LoginDto } from '../dto/auth/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @GetUser('id') userId: number,
  ): Promise<{ message: string }> {
    await this.authService.logout(userId);

    return {
      message: 'Successfully logged out',
    };
  }
}