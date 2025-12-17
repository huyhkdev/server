import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '../common/enums/userInfo.enum';
import { ErrorMessage } from '../common/constants/errorMessage.constant';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role === Role.ADMIN) return true;
    throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
  }
}
