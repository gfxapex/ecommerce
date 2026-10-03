import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../generated/prisma/enums";

export class UserResponseDto {
  @ApiProperty({description:"User ID",example:"123"})
  id: number;

  @ApiProperty({description:"User email address",example:"user@example.com"})
  email: string;

  @ApiProperty({description:"User first name",example:"John"})
  firstName: string |null;

  @ApiProperty({description:"User last name",example:"doe"})
  @Expose()
  lastName: string|null;

  @ApiProperty({ description:"User role", enum: Role })
  role: Role;

  @ApiProperty({description:"User created",example:""})
  createdAt: Date;

  @ApiProperty({description:"User ",example:""})
  updatedAt: Date;
}