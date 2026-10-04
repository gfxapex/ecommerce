import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';



import { AuthController } from './auth-controller';
import { AuthService } from './auth-service';

import { PrismaModule } from '../prisma/prisma-module';
import { UserModule } from '../user/user-module';
import { JwtTokenService } from './jwt-token-service';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  //  
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: Number(process.env.JWT_EXPIRE_IN) },
      }),
    }),
    PrismaModule,UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtTokenService],
  
})
export class AuthModule {}
