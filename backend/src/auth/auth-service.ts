import {
    BadRequestException,
    ConflictException, Injectable, InternalServerErrorException, UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { SignupDto } from '../dto/auth/signup-dto';
import { LoginDto } from '../dto/auth/login-dto';
import { UsersService } from '../user/user-service';
import { JwtTokenService } from './jwt-token-service';
import { AuthResponseDto } from '../dto/auth/auth-response-dto';
import { PrismaService } from '../prisma/prisma-service';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 12;
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UsersService,
        private readonly jwtT: JwtTokenService,
    ) { }

    // -------------------------
    // SIGNUP
    // -------------------------
    async signup(dto: SignupDto) {
        const { firstName, lastName, username, email, phone, password, confirmPassword, role } = dto;

  // 1. Password confirmation check
        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        // 1. Check duplicate email, username, or phone
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }, { phone }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('User with this email already exists');
            }
            if (existingUser.username === username) {
                throw new ConflictException('Username is already taken');
            }
            if (existingUser.phone === phone) {
                throw new ConflictException('Phone number is already registered');
            }
        }

        // 2. Hash password once safely
        try {
            const hashPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

            // 3. Save user to database
            const user = await this.prisma.user.create({
                data: {
                    username,
                    email,
                    phone,
                    role: role,
                    password: hashPassword,
                    firstName, lastName
                },
                select: { id: true, username: true, email: true, phone: true, firstName: true, lastName: true, role: true, password: false }
            });

            // token
            // const tokens = await this.jwtT.generateTokens(user.id, user.email);
            // await this.jwtT.updatedRefreshTokens(user.id, tokens.refreshToken);

            // return { ...tokens, user }
            return {
                message: 'Account created successfully. Please login.',
                user,
            };

        } catch (error) {
            console.error("Error creating user in database:", error);
            throw new InternalServerErrorException('Failed to register account');
        }

    }

    // login
   async login(dto: LoginDto) {
    const { identifier, password } = dto;

    const user = await this.prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier },
                { email: identifier },
                { phone: identifier },
            ],
        },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid email, username, or password');
    }

    const accessToken = await this.jwtT.generateToken(
        user.id,
        user.email,
    );

    return {
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    };
}

// logout
    async logout(userId: number): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId }, data: { refreshToken: null }
        });
    }

}