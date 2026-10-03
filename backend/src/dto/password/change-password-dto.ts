import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password must not be empty' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password must not be empty' })
  @MinLength(8, {
    message: 'New password must be at least 8 characters long',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number & one special character',
    },
  )
  newPassword: string;
}