import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../core/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserSeeder {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async run() {
        const usuarios = [
        { email: 'ignacio@ignacio.com', password: '123456' },
        ];

        const totalUsuarios = await this.userRepository.count();
        if (totalUsuarios === 0) {
            for (const usuario of usuarios) {
                usuario.password = hashSync(usuario.password, 10);
                await this.userRepository.save(usuario);
            }
        console.log('Usuarios creados desde el seeder');
        }
    }
}
