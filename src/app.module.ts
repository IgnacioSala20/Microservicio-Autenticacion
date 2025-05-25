import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AuthGuard } from './middlewares/auth.middleware';
import { JwtService } from './jwt/jwt.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/roles.entity';
import { UserEntity } from './entities/user.entity';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { PermisosService } from './permisos/permisos.service';
import { PermisosController } from './permisos/permisos.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5436,
        database: 'usuarios',
        username: 'ignacio',
        password: 'ignacio',
        synchronize: true,
        entities,
      }),
    TypeOrmModule.forFeature(entities),
    PermissionEntity,
    RoleEntity,
    UserEntity],
  controllers: [AppController,UsersController, RolesController, PermisosController],
  providers: [AuthGuard, JwtService, UsersService, RolesService, PermisosService],
})
export class AppModule {}
