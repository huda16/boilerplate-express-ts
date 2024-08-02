import fs from "fs";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

class StorageService {
  private _folder: string;

  constructor(folder: string) {
    this._folder = folder;

    this.ensureFolderExists(folder).catch((error) => {
      console.error("Error ensuring folder exists:", error);
    });
  }

  private async ensureFolderExists(folder: string): Promise<void> {
    if (!(await exists(folder))) {
      await mkdir(folder, { recursive: true });
    }
  }

  async writeFile(
    file: Express.Multer.File // Update to use Multer's file type
  ): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const path = `${this._folder}/${filename}`;
    console.log(path);

    return new Promise<string>((resolve, reject) => {
      fs.writeFile(path, file.buffer, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(filename);
      });
    });
  }
}

export default StorageService;
