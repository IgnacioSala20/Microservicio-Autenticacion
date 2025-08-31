import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './middlewares/auth.middleware';
import { JwtService } from './jwt/jwt.service';
import { UsersController } from './resource/users/users.controller';
import { UsersService } from './resource/users/users.service';
import { RolesController } from './resource/roles/roles.controller';
import { RolesService } from './resource/roles/roles.service';
import { PermisosService } from './resource/permisos/permisos.service';
import { PermisosController } from './resource/permisos/permisos.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './resource/users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { RolesModule } from './resource/roles/roles.module';
import { PermisosModule } from './resource/permisos/permisos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DATABASE_TYPE', 'postgres'),
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DATABASE_PORT', '5432')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: false,
        autoLoadEntities: true,
        entities: [__dirname + '/database/core/**/*.entity{.ts,.js}'],
      }),
    }),
    UsersModule,
    JwtModule,
    RolesModule,
    PermisosModule,
    ],
  controllers: [AppController],
  providers: [AuthGuard],
})
export class AppModule {}
