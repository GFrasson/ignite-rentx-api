import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import { createConnection } from "../index";

export async function createAdmin() {
    const connection = await createConnection("localhost");

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
        `
        INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES ('${id}', 'admin', 'admin@admin.com.br', '${password}', true, 'now()', 'XXXXXX')
        `
    );

    await connection.destroy();
}

createAdmin().then(() => console.log("User admin created!"));
