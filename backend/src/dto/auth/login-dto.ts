import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Identifier must not be empty' })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number & one special character',
    },
  )
  password: string;
}