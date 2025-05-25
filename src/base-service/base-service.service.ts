import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
    UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '../entities/base.entity';  // Importamos BaseEntity
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export abstract class BaseService<T extends BaseEntity> {
    findManyOptions: FindManyOptions<T> = {};
    findOneOptions: FindOneOptions<T> = {};

    constructor(protected repository: Repository<T>) {}

    async find(options: FindManyOptions<T> = {}): Promise<T[]> {
    const findOptions = { ...this.findManyOptions, ...options };
    return this.repository.find(findOptions);
    }
    async findOne(options: FindOneOptions<T> = {}): Promise<T | null> {
    const findOptions = { ...this.findOneOptions, ...options };
    return this.repository.findOne(findOptions);
    }

    async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
    }

    async update(
    id: string | number,
    entity: QueryDeepPartialEntity<T>,
    ): Promise<UpdateResult> {
    return this.repository.update(id, entity);
    }

    //Borrado logico! , no contempla borrado total
    async delete(id: number | string):Promise<{ message: string }> {
    //Lo que hace el FindOptionsWhere es una conversion explicita de un objeto a un objeto FindOptionsWhere
    const entity = await this.repository.findOneBy({id} as FindOptionsWhere<T>);
    if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
    }
    return {"message": "deleted" };
    }
    async restore(id: number | string): Promise<T> {
        const entity = await this.repository.findOne({
            where: { id } as FindOptionsWhere<T>,
            withDeleted: true,
        });
        if (!entity) {
            throw new Error(`Entity with id ${id} not found`);
        }
        await this.repository.restore(id);
        const restored = await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
        if (!restored) {
            throw new Error(`Entity with id ${id} could not be restored`);
        }
        return restored;
    }
    async paginate(options: IPaginationOptions): Promise<Pagination<T>> {
        const queryBuilder = this.repository.createQueryBuilder('entity');
        queryBuilder.orderBy('entity.id', 'ASC'); // orden por defecto, se puede organizar segun como querramos 
        //ASC es ascendente y DESC es descendente
        return paginate<T>(queryBuilder, options);
    }

}