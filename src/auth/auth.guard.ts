import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessage } from '../common/constants/errorMessage.constant';
import { DevUserInfo } from '../common/constants/userInfo.dev';
import {
  EnvironmentVariable,
  Environment,
} from '../common/enums/environment.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const activeEnv = this.configService.getOrThrow<string>(
      EnvironmentVariable.NODE_ENV,
    );
    const isDevelopment = activeEnv === Environment.DEVELOPMENT;
    if (isDevelopment) {
      request.user = DevUserInfo;
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(ErrorMessage.TOKEN_NOT_FOUND);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(EnvironmentVariable.JWT_SECRET),
      });
      // Attach user info to request
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    const [bearer, token] = authHeader.split(' ');
    return bearer === 'Bearer' && token ? token : null;
  }
}
