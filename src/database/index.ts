import "dotenv/config";
import { DataSource, DatabaseType } from "typeorm";

const dbType: DatabaseType = "postgres";

export const AppDataSource = new DataSource({
    type: dbType,
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
    synchronize: true,
    logging: false,
    entities: [process.env.TYPEORM_ENTITIES],
    migrations: [process.env.TYPEORM_MIGRATIONS],
});

AppDataSource.initialize()
    .then(() => console.log("DataSource initialized"))
    .catch((error) => console.log("Error to initialize Datasource:", error));
