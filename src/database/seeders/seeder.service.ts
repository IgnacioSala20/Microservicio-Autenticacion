import { Injectable } from '@nestjs/common';
import { RoleSeeder } from './role.seeder';
import { PermisosSeeder } from './permisos.seeder';

@Injectable()
export class SeederService {
    constructor(
        private readonly roleSeeder: RoleSeeder,
        private readonly permisosSeeder: PermisosSeeder,
    ) {}

    async seedAll() {
        console.log('🚀 Iniciando seeding...');
        await this.roleSeeder.run();
        await this.permisosSeeder.run();
        console.log('✅ Seeding completo');
    }
}
