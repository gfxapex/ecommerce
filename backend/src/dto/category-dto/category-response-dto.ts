import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CategoryResponseDto {

    id: number;

    // @IsString()
    // @IsNotEmpty()
    // @MaxLength(100)
    name: string;

    // @IsString()
    // @IsOptional()
    // @MaxLength(255)
    description: string | null;

    // @IsString()
    // @IsOptional()
    // @MaxLength(100)
    slug: string | null;

    // @IsString()
    // @IsOptional()
    // @MaxLength(255)
    imageUrl: string | null;

    // @IsBoolean()
    // @IsOptional()
    isActive?: boolean;

    productCount: number;

    createdAt: Date;

    updatedAt: Date;

}