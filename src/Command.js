import fs from 'node:fs/promises';
import os from 'node:os';
import process from 'node:process';
import path from 'node:path';
import Log from './Log.js';

class Command {
  constructor(readline) {
    this.rl = readline;
    this.currentDir = os.homedir();
    this.log = new Log();
    this.log.success(`You are currently in ${this.currentDir}`);
  }

  async prompt() {
    try {
      const input = await this.rl.question('\nEnter a command: ');
      await this.process(input);
      this.log.success(`You are currently in: ${this.currentDir}`);

      await this.prompt();
    } catch (error) {
      console.error('Error reading user command: ', error);
    }
  }

  async process(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'up':
        this.up();
        break;
      case 'cd':
        if (args.length === 1) {
          await this.cd(args[0]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: cd <directory>');
        }
        break;
      case 'ls':
        await this.ls();
        break;
      case '.exit':
        this.exit();
        break;
      default:
        this.log.error('Invalid input');
    }
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

  exit() {
    process.exit();
  }
}

export default Command;
