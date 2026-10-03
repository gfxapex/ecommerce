import {
    BadRequestException,
    ConflictException, Get, Injectable,
    NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma-service";
import { CreateCategoryDto } from "../dto/category-dto/create-category-dto";
import { CategoryResponseDto } from "../dto/category-dto/category-response-dto";
import { Category, Prisma } from "../generated/prisma/client";
import { QueryCategoryDto } from "../dto/category-dto/query-category-dto";
import { UpdateCategoryDto } from "../dto/category-dto/update-category-dto";


@Injectable()
export class CategoryService {

    private formatCategory(
        category: Category,
        productCount: number,
    ): CategoryResponseDto {
        return {
            id: category.id,
            name: category.name,
            description: category.description ?? null,
            slug: category.slug,
            imageUrl: category.imageUrl ?? null,
            isActive: category.isActive,
            productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const { name, slug, ...rest } = dto;

        const categorySlug =
            slug ??
            name
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^\w-]/g, "");

        const existingCategory =
            await this.prisma.category.findUnique({
                where: {
                    slug: categorySlug,
                },
            });

        if (existingCategory) {
            throw new ConflictException(
                `Category with slug already exists: ${categorySlug}`,
            );
        }

        const category = await this.prisma.category.create({
            data: {
                name,
                slug: categorySlug,
                ...rest,
            },
        });

        return this.formatCategory(category, 0);
    }


    async findAll(
        dto: QueryCategoryDto): Promise<{
            data: CategoryResponseDto[];
            meta: { total: number; page: number; limit: number; totalPage: number; };
        }> {
        const {
            isActive,
            search,
            page = 1,
            limit = 10,
        } = dto;

        const where: Prisma.CategoryWhereInput = {};

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.OR = [{ name: { contains: search, mode: "insensitive" } },
            {
                description: {
                    contains: search,
                    mode: "insensitive"
                }
            }];
        }

        const total = await this.prisma.category.count({ where });
        const categories = await this.prisma.category.findMany({
            where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" }, include: { _count: { select: { products: true } } }
        });

        const data = categories.map((category) => this.formatCategory(category, category._count.products),
        );

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit),
            },
        };
    }
    // find by id
    async findOne(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id }, include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        if (!category) { throw new NotFoundException("Category not found"); }
        return this.formatCategory(category, Number(category._count.products));
    }

    // find category by slug
    async findBySlug(slug: string): Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({ where: { slug }, include: { _count: { select: { products: true } } } });
        if (!category) { throw new NotFoundException("Product not found"); }
        return this.formatCategory(category, Number(category._count.products));
    }

    // update category
    async update(
        id: number,
        dto: UpdateCategoryDto,
    ): Promise<CategoryResponseDto> {

        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new NotFoundException("Category not found");
        }

        // Check slug only when slug is being changed
        if (dto.slug && dto.slug !== existingCategory.slug) {

            const slugTaken = await this.prisma.category.findUnique({
                where: {
                    slug: dto.slug,
                },
            });

            if (slugTaken) {
                throw new ConflictException(
                    "Category with slug already exists:", dto.slug,
                );
            }
        }

        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: dto,
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });

        return this.formatCategory(
            updatedCategory,
            updatedCategory._count.products,
        );
    }

    // category delete (admin only)
    async remove(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id }, include: { _count: { select: { products: true } } }
        });
        if (!category) { throw new NotFoundException("Category not found") }
        if (category._count.products > 0) {
            throw new BadRequestException(`cannot delete category ${category._count.products}product, remove or assign first`,);
        }
        await this.prisma.category.delete({ where: { id } });
        return {message:"Category deleted successfully"}
    }

}