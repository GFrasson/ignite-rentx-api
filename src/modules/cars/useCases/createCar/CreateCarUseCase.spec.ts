import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepository = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepository);
    });

    it("should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Car Name",
            description: "Car description",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "Category",
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a new car with license plate that already exists", async () => {
        expect(async () => {
            await createCarUseCase.execute({
                name: "Car1",
                description: "Car description 1",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand1",
                category_id: "Category1",
            });

            await createCarUseCase.execute({
                name: "Car2",
                description: "Car description 2",
                daily_rate: 100,
                license_plate: "ABC-1234",
                fine_amount: 60,
                brand: "Brand2",
                category_id: "Category2",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to create a new car with available set as true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car Available",
            description: "Car description",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "Category",
        });

        expect(car.available).toBe(true);
    });
});
