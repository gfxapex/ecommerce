import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category-service";
import { JwtAuthGuard } from "../common/guards/jwt-auth-guard";
import { RolesGuard } from "../common/guards/roles-guard";
import { Roles } from "../common/decorator/roles-decorator";
import { Role } from "../generated/prisma/enums";
import { CreateCategoryDto } from "../dto/category-dto/create-category-dto";
import { CategoryResponseDto } from "../dto/category-dto/category-response-dto";
import { QueryCategoryDto } from "../dto/category-dto/query-category-dto";
import { UpdateCategoryDto } from "../dto/category-dto/update-category-dto";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post("create")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        return this.categoryService.create(dto);
    }

    // find all
    @Get()
    async findAllCategory(@Query() dto: QueryCategoryDto) {
        return await this.categoryService.findAll(dto)
    }

    @Get(":id")
    async findOneCategory(@Param("id") id: number): Promise<CategoryResponseDto> {
        return this.categoryService.findOne(id);
    }

    @Get("slug/:slug")
    async findBySlug(@Param("slug")slug: string):Promise<CategoryResponseDto>{
return await this.categoryService.findBySlug(slug);
    }

    // update category (Admin only)
    @Patch(":id")
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    async updateCategory (@Param("id") id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto>{
return this.categoryService.update(id, dto);
    }

    // delete category (admin only)
    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async removeCategory(@Param("id") id: number):Promise<{message: string}>{
        return await this.categoryService.remove(id);
    }

}