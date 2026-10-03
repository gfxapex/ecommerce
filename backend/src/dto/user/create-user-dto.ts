// src/auth/dto/signup.dto.ts
import {
  IsEmail,
  IsEnum,
  IsString,
  IsPhoneNumber,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsPhoneNumber('PK')
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number & one special character',
    },
  )
  password: string;

  @Optional()
  @IsString()
  firstName?: string;
  @Optional()
  @IsString()
  lastName?: string;

  @IsEnum(Role)
  role: Role;
}