import { Injectable } from '@nestjs/common';
import { RoleSeeder } from './sedeers/role.seeder';
import { PermisosSeeder } from './sedeers/permisos.seeder';
import { UserSeeder } from './sedeers/users.seeder';

@Injectable()
export class SeederService {
    constructor(
        private readonly roleSeeder: RoleSeeder,
        private readonly permisosSeeder: PermisosSeeder,
        private readonly userSeeder: UserSeeder,
    ) {}

    async seedAll() {
        console.log('Iniciando seeding');
        await this.roleSeeder.run();
        await this.permisosSeeder.run();
        await this.userSeeder.run();
        console.log('Seeding completo');
    }
}
