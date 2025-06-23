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
    const userPermissions = user.permissionCodes.map(p => p.toLowerCase());
    const hasPermission = permissions.some(p => userPermissions.includes(p.toLowerCase()));
    if (!hasPermission) {
      throw new UnauthorizedException();
    }
    return true;
  }

  async register(body: RegisterDTO) {
    try {
      console.log("voy por aca ahora")
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);

      //contar cuántos usuarios existen para ver que no hay ningunos
      const totalUsuarios = await this.repository.count();
      console.log("total:",totalUsuarios)
      if (totalUsuarios === 0) {
        //Si es el primer usuario que se va a crear, hay que modificar este where y poner el nombre del rol que se le quiere asignar
        //de tal forma que el primer usuario sea un superadmin o el que fuese y a partir de ahi tiene todos los permisos
        const rolSuperAdmin = await this.roleRepository.findOne({ where: { name: "Administrador" } });
        console.log(rolSuperAdmin)
        if (!rolSuperAdmin) {
          throw new BadRequestException('El rol buscado no existe');
        }
        user.role = rolSuperAdmin;
      }
      console.log("Usuario a registrar:", user);
      await this.repository.save(user);

      return { status: 'created' };
    } catch (error) {
      console.error(error)
      throw new HttpException('Error de creación: ' + error.message, 500);
    }
  }

  async login(body: LoginDTO) {
    console.log("entro aca primero")
    const user = await this.findByEmail(body.email);
    console.log("encuentro el usuario:", user)
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

    //Aca evitamos que un admin se modifique a sí mismo
    if (user.id === adminUser.id) {
      throw new BadRequestException('No podés cambiar tu propio rol');
    }
    user.role = rol;
    await this.repository.save(user);

    return {message: `Rol asignado correctamente a ${user.email}`,userId: user.id,nuevoRol: rol.name,};
    }
}