import fs from "fs";
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
    async save(file: string, folder: string): Promise<string> {
        await fs.promises.rename(
            resolve(upload.tmpFolder, file),
            resolve(upload.tmpFolder, folder, file)
        );

        return file;
    }

    async delete(file: string, folder: string): Promise<void> {
        const filename = resolve(upload.tmpFolder, folder, file);

        try {
            // Verifies if a file exists
            await fs.promises.stat(filename);
        } catch {
            return;
        }

        // Deletes the file
        await fs.promises.unlink(filename);
    }
}

export { LocalStorageProvider };
