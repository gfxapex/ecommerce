import { Module } from '@nestjs/common';
import { UsersService } from './user-service';
import { PrismaService } from '../prisma/prisma-service';
import { UserController } from './user-controller';

@Module({
  controllers:[UserController],
  providers: [
    UsersService,
    PrismaService,
  ],
  exports: [
    UsersService,
  ],
})
export class UserModule {}