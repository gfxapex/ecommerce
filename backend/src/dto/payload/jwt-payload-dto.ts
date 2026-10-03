import { IsEnum, IsEmail, IsNumber, IsString } from 'class-validator';
import { UserStatus, Role } from '../../generated/prisma/client';

export class JwtPayloadDto {
    @IsNumber()
    sub: number;

    @IsEmail()
    email: string;

    // @IsString()
    // username: string;

    // @IsEnum(Role)
    // userType: Role;

    // @IsEnum(UserStatus)
    // status: UserStatus;
}