import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../shared/authentication/jwt/jwt-access.strategy';
import { LocalStrategy } from '../shared/authentication/local/local.strategy';
import { AuthController } from './auth.controller';
import { User } from '../users/entity/users.entity';
import { JwtConfigHelper } from 'src/shared/constants/constants';
import { RolesGuard } from 'src/shared/authentication/role-based/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: JwtConfigHelper.JWT_REFRESH_TOKEN_SECRET,
      signOptions: {
        expiresIn: JwtConfigHelper.JWT_REFRESH_TOKEN_EXPIRES,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
