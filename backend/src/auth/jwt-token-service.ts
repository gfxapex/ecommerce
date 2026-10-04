import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(userId: number, email: string): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: userId,
                email,
            },
            {
                expiresIn: '15m',
            }
        );
    }
}