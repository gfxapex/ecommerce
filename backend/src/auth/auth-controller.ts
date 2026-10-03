// src/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth-service';
import { SignupDto } from '../dto/auth/signup-dto';
import { AuthResponseDto } from '../dto/auth/auth-response-dto';
import { JwtTokenService } from './jwt-token-service';
import { RefreshTokenGuard } from '../common/guards/refresh-token-guard';
import { GetUser } from '../common/decorator/get-user-decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';
import { LoginDto } from '../dto/auth/login-dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly jwtT: JwtTokenService) {}

  // register
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  // refresh access token
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refresh(@GetUser("id") userId: number): Promise<AuthResponseDto>{
    return await this.jwtT.refreshTokens(userId);
  }

  // logout user and invalidate refresh token
  @Post("logout")
    @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser("id") userId: number): Promise<{message: string}>{
    await this.authService.logout(userId);
    return{message:"Successfully logged out"}
  }


// login
  @Post("login")
    @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto):Promise<AuthResponseDto>{
    return await this.authService.login(dto);
  }
}