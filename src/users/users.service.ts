import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserI } from 'src/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from 'src/entities/roles.entity';
import { BaseService } from 'src/base-service/base-service.service';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
    constructor(
    private jwtService: JwtService,

    @InjectRepository(UserEntity)
    protected readonly service: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(service);
  }
  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }
  canDo(user: UserI, permission: string): boolean {
    const permissions = permission.split(',');
    const userPermissions = user.permissionCodes.map(p => p.toUpperCase());
    const hasPermission = permissions.some(p => userPermissions.includes(p.toUpperCase()));
    if (!hasPermission) {
      throw new UnauthorizedException();
    }
    return true;
  }

  async register(body: RegisterDTO) {
    try {
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);
      await this.repository.save(user);
      return { status: 'created' };
    } catch (error) {
      throw new HttpException('Error de creacion', 500);
    }
  }

  async login(body: LoginDTO) {
    const user = await this.findByEmail(body.email);
    if (user == null) {
      throw new UnauthorizedException();
    }
    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
      refreshToken: this.jwtService.generateToken(
        { email: user.email },
        'refresh',
      )
    };
  }
  async findByEmail(email: string): Promise<UserEntity> {
  return await this.repository.findOne({
    where: { email },
    relations: {
      role: {
        permissions: true,
      },
    },
  });
}

  async findById(id: number): Promise<UserEntity> {
    return await this.repository.findOneBy({ id });
  }

  async asignarRol(userId: number, rolNombre: string, adminUser: UserEntity) {
  const user = await this.repository.findOne({ where: { id: userId }, relations: ['role'] });
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const rol = await this.roleRepository.findOne({ where: { name: rolNombre } });
  if (!rol) {
    throw new NotFoundException('Rol no encontrado');
  }

  // Evitar que un admin se modifique a sí mismo (opcional pero recomendado)
  if (user.id === adminUser.id) {
    throw new BadRequestException('No podés cambiar tu propio rol');
  }
  user.role = rol;
  await this.repository.save(user);

  return {
    message: `Rol asignado correctamente a ${user.email}`,
    userId: user.id,
    nuevoRol: rol.name,
  };
  }
}