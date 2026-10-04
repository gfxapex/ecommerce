import { Role } from "../../generated/prisma/enums";

export class AuthResponseDto {
    accessToken?: string;
    message?: string;

    user: {
        id: number;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: Role;
    };
}