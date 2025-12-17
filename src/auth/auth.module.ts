import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { EnvironmentVariable } from '../common/enums/environment.enum';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const jwtSecret = configService.get<string>(EnvironmentVariable.JWT_SECRET);
        const jwtExpiresIn = configService.get(EnvironmentVariable.JWT_EXPIRES_IN) || '7d';
        
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard, AdminGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
