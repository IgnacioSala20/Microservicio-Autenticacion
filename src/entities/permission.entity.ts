
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./roles.entity";
@Entity('permisos')
export class PermissionEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @ManyToMany(() => RoleEntity, role => role.permission)
    role: RoleEntity;
}