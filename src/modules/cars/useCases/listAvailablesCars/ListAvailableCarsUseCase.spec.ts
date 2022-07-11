import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("List Cars", () => {
    let availableCars: Car[];

    beforeEach(async () => {
        carsRepository = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);

        availableCars = [];
        availableCars.push(
            await carsRepository.create({
                name: "Car1",
                description: "Car description",
                daily_rate: 110.0,
                license_plate: "DEF-1234",
                fine_amount: 40,
                brand: "CarBrand1",
                category_id: "CategoryId",
            }),
            await carsRepository.create({
                name: "Car2",
                description: "Car description",
                daily_rate: 110.0,
                license_plate: "DEF-1235",
                fine_amount: 40,
                brand: "CarBrand2",
                category_id: "CategoryId2",
            })
        );
    });

    it("should be able to list all available cars", async () => {
        const carsList = await listAvailableCarsUseCase.execute();

        expect(carsList).toEqual(availableCars);
    });

    it("should be able to list all available cars by name", async () => {
        const carsFilteredByName = await listAvailableCarsUseCase.execute({
            name: "Car2",
        });

        expect(carsFilteredByName).toEqual([availableCars[1]]);
    });

    it("should be able to list all available cars by brand", async () => {
        const carsFilteredByBrand = await listAvailableCarsUseCase.execute({
            brand: "CarBrand2",
        });

        expect(carsFilteredByBrand).toEqual([availableCars[1]]);
    });

    it("should be able to list all available cars by category", async () => {
        const carsFilteredByCategoryId = await listAvailableCarsUseCase.execute({
            category_id: "CategoryId2",
        });

        expect(carsFilteredByCategoryId).toEqual([availableCars[1]]);
    });
});
