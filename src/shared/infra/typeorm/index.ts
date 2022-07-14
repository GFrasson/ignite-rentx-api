import "dotenv/config";
import { DataSource, DatabaseType } from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";
import { Category } from "@modules/cars/infra/typeorm/entities/Category";
import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { CreateCategories1654777657996 } from "./migrations/1654777657996-CreateCategories";
import { CreateSpecifications1654866421266 } from "./migrations/1654866421266-CreateSpecifications";
import { CreateUsers1654953994849 } from "./migrations/1654953994849-CreateUsers";
import { AlterUserDeleteUsername1654956568094 } from "./migrations/1654956568094-AlterUserDeleteUsername";
import { AlterUserAddAvatar1655136259554 } from "./migrations/1655136259554-AlterUserAddAvatar";
import { CreateCars1657285222222 } from "./migrations/1657285222222-CreateCars";
import { CreateSpecificationsCars1657549219871 } from "./migrations/1657549219871-CreateSpecificationsCars";
import { CreateCarImages1657633778315 } from "./migrations/1657633778315-CreateCarImages";
import { CreateRentals1657729351105 } from "./migrations/1657729351105-CreateRentals";

const dbType: DatabaseType = "postgres";

const AppDataSource = new DataSource({
    type: dbType,
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.NODE_ENV === "test" ? "rentx_test" : process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
    synchronize: false,
    logging: false,
    entities: [Category, Specification, User, Car, CarImage, Rental],
    migrations: [
        CreateCategories1654777657996,
        CreateSpecifications1654866421266,
        CreateUsers1654953994849,
        AlterUserDeleteUsername1654956568094,
        AlterUserAddAvatar1655136259554,
        CreateCars1657285222222,
        CreateSpecificationsCars1657549219871,
        CreateCarImages1657633778315,
        CreateRentals1657729351105,
    ],
});

// AppDataSource.initialize()
//     .then(() => console.log("DataSource initialized"))
//     .catch((error) => console.log("Error to initialize Datasource:", error));

export function createConnection(host = "database"): Promise<DataSource> {
    return AppDataSource.setOptions({
        host: process.env.NODE_ENV === "test" ? "localhost" : host,
    }).initialize();
}

export default AppDataSource;
