// src/auth/strategies/refresh-token.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma-service";
import * as bcrypt from "bcryptjs";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'fallback_secret',
            passReqToCallback: true,
        });
    }

// validate refresh token
    async validate(req: Request, payload: { sub: number; email: string }) {
        console.log("Refresh token strategy", RefreshTokenStrategy);
        console.log("payload", { sub: payload.sub, email: payload.email });

        // auth header
        const authHeader = req.headers.authorization;
       
        if (!authHeader) {
            console.log("No Authorization header found");
            throw new UnauthorizedException("Refresh token not provided");
        }

        // refresh token
        const refreshToken = authHeader.replace('Bearer ', '').trim();
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh Token is empty after extraction");
        }

        // user
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }, select: {
                id: true, email: true, role: true, refreshToken: true
            }
        });

        if (!user || user.refreshToken) {
            throw new UnauthorizedException("Invalid refresh token");
        }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken!);
      if(!refreshTokenMatches){
        throw new UnauthorizedException("Invalid refresh does not match");
      }
      return {id: user.id, email: user.email, role: user.role}
    }
}
