import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch,  UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth-guard";
import { RolesGuard } from "../common/guards/roles-guard";
import { UsersService } from "./user-service";
import { UserResponseDto } from "../dto/user/user-response-dto";
import { Roles } from "../common/decorator/roles-decorator";
import { Role } from "../generated/prisma/enums";
import { UpdateUserDto } from "../dto/user/update-user-dto";
import { GetUser } from "../common/decorator/get-user-decorator";
import { ChangePasswordDto } from "../dto/password/change-password-dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("user")
export class UserController {
    constructor(private readonly userService: UsersService) { }

    @Get("me")
    async findOne(
        @Param("id") id: number
    ): Promise<UserResponseDto> {
        return this.userService.findById(id);
    }



    // Get all users(for admin purpose)

    @Roles(Role.ADMIN)
    async findAll(): Promise<UserResponseDto[]> {
        return await this.userService.findAll();
    }

    //profile update
    @Patch("me")
    async updateProfile(userId: number,
        @Body() dto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.update(userId, dto);
    }

    // change current user password
    @Patch("me/password")
    @HttpCode(HttpStatus.OK)
    async changePassword(@GetUser("id") userId: number, @Body() dto: ChangePasswordDto): Promise<{ message: string }> {
        return await this.userService.changePassword(userId, dto)
    }

    //  delete current user
    @Delete("me")
    @HttpCode(HttpStatus.OK)
    async deleteAccount(@GetUser("id") userId: number) {
        return this.userService.remove(userId);
    }

    // delete user by id(for admin purpose)
    @Delete(":id")
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param("id", ParseIntPipe) id: number):Promise<{message: string}>{
        return await this.userService.remove(id);
    }

}