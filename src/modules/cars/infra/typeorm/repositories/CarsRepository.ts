import { Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import AppDataSource from "@shared/infra/typeorm";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = AppDataSource.getRepository(Car);
    }

    async create({
        name,
        license_plate,
        fine_amount,
        description,
        daily_rate,
        category_id,
        brand,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            name,
            license_plate,
            fine_amount,
            description,
            daily_rate,
            category_id,
            brand,
        });

        await this.repository.save(car);

        return car;
    }

    async findByLicensePlate(licensePlate: string): Promise<Car> {
        const car = await this.repository.findOneBy({
            license_plate: licensePlate,
        });

        return car;
    }

    async findAvailable(name?: string, brand?: string, category_id?: string): Promise<Car[]> {
        const carsQuery = this.repository
            .createQueryBuilder("cars")
            .where("available = :available", { available: true });

        if (brand) {
            carsQuery.andWhere("brand = :brand", { brand });
        }

        if (name) {
            carsQuery.andWhere("name = :name", { name });
        }

        if (category_id) {
            carsQuery.andWhere("category_id = :category_id", { category_id });
        }

        const cars = await carsQuery.getMany();

        return cars;
    }
}

export { CarsRepository };
