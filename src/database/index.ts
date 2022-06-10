import "dotenv/config";
import { DataSource, DatabaseType } from "typeorm";

import { Category } from "../modules/cars/entities/Category";
import { Specification } from "../modules/cars/entities/Specification";
import { CreateCategories1654777657996 } from "./migrations/1654777657996-CreateCategories";
import { CreateSpecifications1654866421266 } from "./migrations/1654866421266-CreateSpecifications";

const dbType: DatabaseType = "postgres";

const AppDataSource = new DataSource({
    type: dbType,
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
    synchronize: true,
    logging: false,
    entities: [Category, Specification],
    migrations: [CreateCategories1654777657996, CreateSpecifications1654866421266],
});

// AppDataSource.initialize()
//     .then(() => console.log("DataSource initialized"))
//     .catch((error) => console.log("Error to initialize Datasource:", error));

export function createConnection(host = "database"): Promise<DataSource> {
    return AppDataSource.setOptions({ host }).initialize();
}

export default AppDataSource;
