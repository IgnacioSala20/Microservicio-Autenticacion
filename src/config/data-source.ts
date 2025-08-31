import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserEntity } from '../database/core/user.entity';
import { RoleEntity } from '../database/core/roles.entity';
import { PermissionEntity } from 'src/database/core/permission.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: true,
    entities: [UserEntity, RoleEntity, PermissionEntity],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});
