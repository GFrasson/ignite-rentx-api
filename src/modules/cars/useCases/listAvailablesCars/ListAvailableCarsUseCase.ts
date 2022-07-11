import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

interface IRequestFilter {
    name?: string;
    brand?: string;
    category_id?: string;
}

@injectable()
class ListAvailableCarsUseCase {
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) {}

    async execute(filter?: IRequestFilter): Promise<Car[]> {
        const { name, brand, category_id } = filter || {};
        const cars = await this.carsRepository.findAvailable(name, brand, category_id);
        return cars;
    }
}

export { ListAvailableCarsUseCase };
