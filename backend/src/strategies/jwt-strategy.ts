import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadDto } from '../dto/payload/jwt-payload-dto';
import { PrismaService } from '../prisma/prisma-service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // 
  async validate(payload:{ sub: number ,email: string}) {
    const user = await this.prisma.user.findUnique({
      where:{id: payload.sub},
      select:{id:true,email:true,firstName:true,lastName:true,role:true,createdAt:true,updatedAt:true,password: false}
    });

    if(!user){
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

}
