// src/database/seeders/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeeder } from './role.seeder';
import { RoleEntity } from '../core/roles.entity';
import { PermissionEntity } from '../core/permission.entity';
import { UserEntity } from '../core/user.entity';
import { SeederService } from './seeder.service';
import { PermisosSeeder } from './permisos.seeder';
import { UserSeeder } from './users.seeder';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity]),
    ],
    providers: [
        RoleSeeder,
        PermisosSeeder,
        UserSeeder,
        SeederService,
    ],
    exports: [SeederService],
})
export class SeedModule {}

