import { UserI } from '../../interfaces/user.interface';
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from './roles.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements UserI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  lastname: string
  
  @Index({unique:true})
  @Column()
  email: string;

  @Column()
  password: string;
  
  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;
  permissions: any;

  get permissionCodes(): string[] {
    if (!this.role || !this.role.permissions) return [];
    return this.role.permissions.map(p => p.name);  // o el nombre del campo que tenga el código de permiso
  }
}
