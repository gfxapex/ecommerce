// src/user/user-service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma-service';
import { User } from '../generated/prisma/client';
import { UserResponseDto } from '../dto/user/user-response-dto';
import { UpdateUserDto } from '../dto/user/update-user-dto';
import { ChangePasswordDto } from '../dto/password/change-password-dto';
import * as bcrypt from "bcryptjs";


@Injectable()
export class UsersService {

    private readonly SALT_ROUND = 10;
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async findAll(): Promise<UserResponseDto[]> {
        return await this.prisma.user.findMany({
            select: {
                id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true, password: false,
            }, orderBy: { createdAt: "desc" },
        })
    }

    // Lookups
    async findById(userId: number): Promise<UserResponseDto> {

        const user = await this.prisma.user.findUnique({
            where: { id: userId }, select: {
                id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, updatedAt: true, password: false
            }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async update(userId: number, dto: UpdateUserDto): Promise<UserResponseDto> {
        // existing user
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId, }
        });

        if (!existingUser) { throw new NotFoundException("User not found") }

        if (dto.email && dto.email !== existingUser.email) {
            const emailTaken = await this.prisma.user.findUnique({
                where: { email: dto.email }
            });
            if (emailTaken) {
                throw new NotFoundException("Email is already taken");
            }
        }
        // update
        const updateUser = await this.prisma.user.update({
            where: {
                id: userId
            }, data: dto, select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false
            }

        });



        return updateUser;
    }


    // change password
    async changePassword(userId: number, dto: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword } = dto;
        //   user
        const user = await this.prisma.user.findUnique({ where: { id: userId }, });
       
        if (!user) {
            throw new NotFoundException("User not found");
        }

        // valid password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // duplicate password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (!isSamePassword) {
            throw new BadRequestException(
                'New password must be different from the current password',
            );
        }

        // password hashed
        const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUND);

        await this.prisma.user.update({
            where: {
                id: userId
            }, data: { password: hashedNewPassword }
        });

        return { message: "Password changed successfully" }

    }

    // delete user account
async remove(userId: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundException("User not found");
    }

    await this.prisma.user.delete({
        where: { id: userId }
    });

    return {
        message: "User account deleted successfully"
    };
}

}