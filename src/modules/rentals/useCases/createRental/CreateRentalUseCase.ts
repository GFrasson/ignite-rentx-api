import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";

dayjs.extend(utc);

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

// @injectable()
class CreateRentalUseCase {
    constructor(
        // @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository
    ) {}

    async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
        const minimumRentalTimeInHours = 24;
        const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(car_id);

        if (rentalOpenToCar) {
            throw new AppError("Car is unavailable");
        }

        const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress for the user!");
        }

        const expectedReturnDateFormat = dayjs(expected_return_date).utc().local().format();
        const dateNow = dayjs().utc().local().format();
        const compare = dayjs(expectedReturnDateFormat).diff(dateNow, "hours");

        if (compare < minimumRentalTimeInHours) {
            throw new AppError("Invalid return time!");
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        return rental;
    }
}

export { CreateRentalUseCase };
