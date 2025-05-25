
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./roles.entity";
@Entity('permisos')
export class PermissionEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    codigo: string;
    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity;
}