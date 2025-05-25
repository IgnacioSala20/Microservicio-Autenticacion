
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BaseService } from './base-service.service';  // Importar el servicio base
import { BaseEntity } from '../entities/base.entity';  // Importar BaseEntity (aunque en este caso no es necesario en el controlador, es para ilustrar)
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Request } from 'express';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';
import { AuthGuard } from 'src/middlewares/auth.middleware';

export class BaseController<T extends BaseEntity> {  // Definir que T extiende BaseEntity
    constructor(protected readonly service: BaseService<T>) {}  // Inyectamos el servicio BaseService para el tipo específico
    @Post()
    create(@Body() data: T) {
        return this.service.create(data);  
    }
    @UseGuards(AuthGuard)
    @Permissions(['ver usuarios'])
    @Get('all')
    getAll() {
        return this.service.find(); // sin paginación
    }

    @Get()
    async getPaginated(
        @Req() req: Request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<T>> {
        limit = limit > 100 ? 100 : limit;
        const route = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        return this.service.paginate({
            page,
            limit,
            route,
        });
    }
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne({ where: { id } as FindOptionsWhere<T> });
    }
    @Put(':id')
    update(@Param('id') id: number, @Body() data: QueryDeepPartialEntity<T>) { 
        return this.service.update(id, data); 
    }
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.service.delete(id);  
    }
    @Patch(':id/restore')
    restore(@Param('id') id: number) {
        return this.service.restore(id); 
    }
}

