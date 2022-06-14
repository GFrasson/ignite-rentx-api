import fs from "fs";

export const deleteFile = async (filename: string) => {
    try {
        // Verifies if a file exists
        await fs.promises.stat(filename);
    } catch {
        return;
    }

    // Deletes the file
    await fs.promises.unlink(filename);
};
