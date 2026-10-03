import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma-service';
import { randomBytes } from 'crypto';
import { AuthResponseDto } from '../dto/auth/auth-response-dto';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async generateTokens(userId: number, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString('hex');

    //Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync({ ...payload, refreshId }, { expiresIn: Number(process.env.JWT_EXPIRES_IN) }),
    ]);

    return { accessToken, refreshToken };
  }

  // update refresh token in the database
  async updatedRefreshTokens(userId: number, refreshToken: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken }, // Note: Consider hashing this token before saving it to the DB
      });
    } catch (error) {
      // Handles Prisma record not found error (P2025)
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  // refresh access token
  async refreshTokens(userId: number): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true }
    });
    if(!user){throw new UnauthorizedException("User not found");}
    const tokens = await this.generateTokens(user.id,user.email);
    await this.updatedRefreshTokens(user.id,tokens.refreshToken);
    return {...tokens,user}
  }
}
