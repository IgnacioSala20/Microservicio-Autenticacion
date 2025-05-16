import { UserI } from '../interfaces/user.interface';
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from './roles.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements UserI {
  @PrimaryGeneratedColumn()
  id: number;
  @Index({unique:true})
  @Column()
  email: string;
  @Column()
  password: string;
  @ManyToOne(() => RoleEntity, (role) => role.id)
  role: RoleEntity;


  get permissionCodes() {
    return ['create-users', 'list-products'];
  }
}
