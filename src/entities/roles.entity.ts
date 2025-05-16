import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { UserEntity } from "./user.entity";

@Entity('roles')
export class RoleEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @ManyToMany(() => PermissionEntity, permission => permission.role)
    @JoinTable()
    permission: PermissionEntity[];

    @OneToMany(() => UserEntity, user => user.id)
    user: UserEntity[];
}