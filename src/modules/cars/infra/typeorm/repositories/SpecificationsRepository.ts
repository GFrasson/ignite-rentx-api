import { Repository } from "typeorm";

import {
    ICreateSpecificationDTO,
    ISpecificationsRepository,
} from "@modules/cars/repositories/ISpecificationsRepository";
import AppDataSource from "@shared/infra/typeorm";

import { Specification } from "../entities/Specification";

class SpecificationsRepository implements ISpecificationsRepository {
    private repository: Repository<Specification>;

    constructor() {
        this.repository = AppDataSource.getRepository(Specification);
    }

    async create({ name, description }: ICreateSpecificationDTO): Promise<void> {
        const specification = this.repository.create({
            description,
            name,
        });

        await this.repository.save(specification);
    }

    async findByName(name: string): Promise<Specification> {
        const specification = await this.repository.findOneBy({ name });
        return specification;
    }
}

export { SpecificationsRepository };
