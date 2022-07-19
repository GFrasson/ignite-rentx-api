import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    id: string;
    user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DayJsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ id, user_id }: IRequest): Promise<Rental> {
        let rental = await this.rentalsRepository.findById(id);

        if (!rental) {
            throw new AppError("Rental does not exist");
        }

        const car = await this.carsRepository.findById(rental.car_id);

        const minimumRentalDailys = 1;
        const dateNow = this.dateProvider.dateNow();
        let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

        if (daily <= 0) {
            daily = minimumRentalDailys;
        }

        let total = 0;
        const delayInDays = this.dateProvider.compareInDays(rental.expected_return_date, dateNow);

        if (delayInDays > 0) {
            const totalFine = delayInDays * car.fine_amount;
            total = totalFine;
        }

        total += daily * car.daily_rate;

        rental.end_date = this.dateProvider.dateNow();
        rental.total = total;

        rental = await this.rentalsRepository.create(rental);
        await this.carsRepository.updateAvailable(car.id, true);

        return rental;
    }
}

export { DevolutionRentalUseCase };
