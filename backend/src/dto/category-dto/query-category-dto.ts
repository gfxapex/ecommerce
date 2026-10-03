import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class QueryCategoryDto{

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

@IsOptional()
@IsString()
search: string;

@Type(()=>Number)
@IsNumber()
@Min(1)
@IsOptional()
page = 1;

@Type(()=>Number)
@IsNumber()
@Min(1)
@IsOptional()
limit = 10;


}
