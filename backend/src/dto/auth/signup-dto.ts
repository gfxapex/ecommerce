// src/auth/dto/signup.dto.ts
import { 
  IsEmail, 
  IsEnum, 
  IsString, 
  IsPhoneNumber, 
  MinLength, 
  IsNotEmpty, 
  Matches, 
  IsOptional, 
} from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class SignupDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsPhoneNumber('PK', { message: 'Please provide a valid Pakistani phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEnum(Role, { message: 'Invalid role provided' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}
