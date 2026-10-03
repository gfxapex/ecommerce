import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../../generated/prisma/enums";
import { ROLES_KEY } from "../decorator/roles-decorator";
import { use } from "passport";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass]);
if(!requireRoles){
    return true
}

const {user} = context.switchToHttp().getRequest();
return requireRoles.some((role)=>user.role===role)
     
    }

}