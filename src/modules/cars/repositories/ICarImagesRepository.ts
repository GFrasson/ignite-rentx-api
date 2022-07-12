import { CarImage } from "../infra/typeorm/entities/CarImage";

interface ICreateCarImageDTO {
    car_id: string;
    image_name: string;
}

interface ICarImagesRepository {
    create(data: ICreateCarImageDTO): Promise<CarImage>;
}

export { ICarImagesRepository, ICreateCarImageDTO };
