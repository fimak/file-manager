import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Log from './Log.js';

class FileSystem {
  constructor() {
    this.currentDir = os.homedir();
    this.log = new Log();
  }

  up() {
    try {
      const isWin32 = os.platform() === 'win32';
      const parts = this.currentDir.split(isWin32 ? '\\' : '/');
      if (isWin32 && parts.length > 4 || !isWin32 && parts.length > 3) {
        parts.pop();
        this.currentDir = parts.join(os.platform() === 'win32' ? '\\' : '/');
      }
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async cd(directory) {
    try {
      const destination = directory.startsWith('/') ? directory : path.join(this.currentDir, directory);
      await fs.access(destination);
      console.log(destination);
      this.currentDir = destination;
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async ls() {
    try {
      const list = await fs.readdir(this.currentDir);
      const statsPromises = list.map((file) => {
        return new Promise(async (resolve, reject) => {
          try {
            const stat = await fs.stat(path.join(this.currentDir, file));
            resolve({ name: file, type: stat.isDirectory() ? 'folder' : 'file' })
          } catch (err) {
            reject(err);
          }
        });
      });
      const data = await Promise.all(statsPromises);

      data.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        }
        return a.type === 'folder' ? -1 : 1;
      });
      console.table(data);
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async cat(filePath) {
    try {
      // todo: find why the following code throw exception
      // await pipeline(
      //   createReadStream(path.join(this.currentDir, filePath)),
      //   process.stdout,
      // )
      const readStream = createReadStream(path.join(this.currentDir, filePath));
      readStream.pipe(process.stdout);
      await new Promise((resolve, reject) => {
        readStream.on('end', resolve);
        readStream.on('error', reject);
      });
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async add(filePath) {
    try {
      await fs.writeFile(path.join(this.currentDir, filePath), '');
      this.log.success(`File ${filePath} successfully created!`);
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async rename(oldFilePath, newFilePath) {
    try {
      await fs.rename(path.join(this.currentDir, oldFilePath), path.join(this.currentDir, newFilePath));
      this.log.success(`File ${oldFilePath} moved to ${newFilePath}!`);
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async copy(filePath, newFilePath) {
    try {
      await fs.copyFile(path.join(this.currentDir, filePath), path.join(this.currentDir, newFilePath));
      this.log.success(`File ${filePath} copied to ${newFilePath}!`);
    } catch(err) {
      this.log.error('Operation failed');
    }
  }

  async remove(filePath) {
    try {
      await fs.unlink(path.join(this.currentDir, filePath));
      this.log.success(`File ${filePath} has been removed!`);
    } catch(err) {
      this.log.error('Operation failed');
    }
  }
}

export default FileSystem;
