import { Repository } from "typeorm";

import {
    ICarImagesRepository,
    ICreateCarImageDTO,
} from "@modules/cars/repositories/ICarImagesRepository";
import AppDataSource from "@shared/infra/typeorm";

import { CarImage } from "../entities/CarImage";

class CarImagesRepository implements ICarImagesRepository {
    private repository: Repository<CarImage>;

    constructor() {
        this.repository = AppDataSource.getRepository(CarImage);
    }

    async create({ car_id, image_name }: ICreateCarImageDTO): Promise<CarImage> {
        const carImage = this.repository.create({
            car_id,
            image_name,
        });

        await this.repository.save(carImage);

        return carImage;
    }
}

export { CarImagesRepository };
