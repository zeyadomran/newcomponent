import fs from "fs";
import path from "path";

export const mkDirPromise = (dirPath: string) =>
  new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(dirPath), (err) => {
      err ? reject(err) : resolve(null);
    });
  });

export const writeFilePromise = (fileLocation: string, fileContent: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileLocation, fileContent, "utf-8", (err) => {
      err ? reject(err) : resolve(null);
    });
  });
