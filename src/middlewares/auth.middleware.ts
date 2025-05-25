import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/request-user';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { Permissions } from './decorators/permissions.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector:Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = request.headers.authorization.replace('Bearer ','');
      if (token == null) {
        throw new UnauthorizedException('El token no existe');
      }
      const payload = this.jwtService.getPayload(token);
      const user = await this.usersService.findByEmail(payload.email);
      request.user = user;
      //AGREGAR LOGICA PARA USAR LOS PERMISOS QUE VIENEN EN EL DECORADOR
      const requiredPermissions = this.reflector.get(Permissions, context.getHandler());
      // Si hay permisos requeridos, los validamos
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAll = requiredPermissions.every(p =>
          user.permissionCodes.includes(p),
        );
        if (!hasAll) {
          throw new UnauthorizedException(
            'No tenés permisos suficientes para acceder',
          );
        }
      }
      
      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
