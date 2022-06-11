import "dotenv/config";
import { DataSource, DatabaseType } from "typeorm";

import { User } from "../modules/accounts/entities/User";
import { Category } from "../modules/cars/entities/Category";
import { Specification } from "../modules/cars/entities/Specification";
import { CreateCategories1654777657996 } from "./migrations/1654777657996-CreateCategories";
import { CreateSpecifications1654866421266 } from "./migrations/1654866421266-CreateSpecifications";
import { CreateUsers1654953994849 } from "./migrations/1654953994849-CreateUsers";
import { AlterUserDeleteUsername1654956568094 } from "./migrations/1654956568094-AlterUserDeleteUsername";

const dbType: DatabaseType = "postgres";

const AppDataSource = new DataSource({
    type: dbType,
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
    synchronize: false,
    logging: false,
    entities: [Category, Specification, User],
    migrations: [
        CreateCategories1654777657996,
        CreateSpecifications1654866421266,
        CreateUsers1654953994849,
        AlterUserDeleteUsername1654956568094,
    ],
});

// AppDataSource.initialize()
//     .then(() => console.log("DataSource initialized"))
//     .catch((error) => console.log("Error to initialize Datasource:", error));

export function createConnection(host = "database"): Promise<DataSource> {
    return AppDataSource.setOptions({ host }).initialize();
}

export default AppDataSource;
