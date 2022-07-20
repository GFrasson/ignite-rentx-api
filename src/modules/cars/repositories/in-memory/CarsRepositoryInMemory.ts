import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
    private cars: Car[] = [];

    async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
            specifications,
            ...(id && { id }),
        });

        this.cars.push(car);

        return car;
    }

    async findByLicensePlate(licensePlate: string): Promise<Car> {
        return this.cars.find((car) => car.license_plate === licensePlate);
    }

    async findAvailable(name?: string, brand?: string, category_id?: string): Promise<Car[]> {
        const availableCars = this.cars.filter((car) => car.available);

        if (!name && !brand && !category_id) return availableCars;

        return availableCars.filter(
            (car) => car.name === name || car.brand === brand || car.category_id === category_id
        );
    }

    async findById(id: string): Promise<Car> {
        return this.cars.find((car) => car.id === id);
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        const findIndex = this.cars.findIndex((car) => car.id === id);
        this.cars[findIndex].available = available;
    }
}

export { CarsRepositoryInMemory };
