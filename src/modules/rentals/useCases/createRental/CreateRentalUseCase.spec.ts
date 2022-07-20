import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayJsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

dayjs.extend(utc);

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepository: RentalsRepositoryInMemory;
let carsRepository: CarsRepositoryInMemory;
let dayjsDateProvider: DayJsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    let car: Car;

    beforeEach(async () => {
        dayjsDateProvider = new DayJsDateProvider();
        rentalsRepository = new RentalsRepositoryInMemory();
        carsRepository = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepository,
            dayjsDateProvider,
            carsRepository
        );

        car = await carsRepository.create({
            name: "Test",
            description: "Car test",
            daily_rate: 100,
            license_plate: "test",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand",
        });
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        const car2 = await carsRepository.create({
            name: "Test2",
            description: "Car test2",
            daily_rate: 100,
            license_plate: "test2",
            fine_amount: 40,
            category_id: "1234",
            brand: "brand",
        });

        await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: car2.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("There's a rental in progress for the user!"));
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "54321",
                car_id: car.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: car.id,
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });

    it("should not be able to create a new rental for a car that does not exist", async () => {
        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "12345",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car does not exist"));
    });
});
