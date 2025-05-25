import { PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;  // Esto asegura que todas las entidades que extiendan de esta clase tengan un id

    // @CreateDateColumn()
    // createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;  // Se utilizará para el borrado lógico
}
