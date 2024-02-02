import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import Crypto from './Crypto.js';
import FileSystem from './FileSystem.js';
import Log from './Log.js';
import OS from './OS.js';
import Zip from './Zip.js';

class Command {
  constructor() {
    this.fs = new FileSystem();
    this.os = new OS();
    this.crypto = new Crypto();
    this.zip = new Zip();
    this.log = new Log();
    this.log.success(`You are currently in ${this.fs.currentDir}`);
  }

  async prompt() {
    try {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const input = await this.rl.question('\nEnter a command: ');
      this.rl.close();

      await this.process(input);
      this.log.success(`You are currently in: ${this.fs.currentDir}`);

      await this.prompt();
    } catch (error) {
      console.error('Error reading user command: ', error);
    } finally {
      if (this.rl) {
        this.rl.close();
      }
    }
  }

  async process(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'up':
        this.fs.up();
        break;
      case 'cd':
        if (args.length === 1) {
          await this.fs.cd(args[0]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: cd <directory>');
        }
        break;
      case 'ls':
        await this.fs.ls();
        break;
      case 'cat':
        if (args.length === 1) {
          await this.fs.cat(args[0]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: cat <filePath>');
        }
        break;
      case 'add':
        if (args.length === 1) {
          await this.fs.add(args[0]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: add <fileName>');
        }
        break;
      case 'rn':
        if (args.length === 2) {
          await this.fs.rename(args[0], args[1]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: rn <oldFilePath> <newFilePath>');
        }
        break;
      case 'cp':
        if (args.length === 2) {
          await this.fs.copy(args[0], args[1]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: rename <filePath> <newFilePath>');
        }
        break;
      case 'mv':
        if (args.length === 2) {
          await this.fs.rename(args[0], args[1]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: mv <oldFilePath> <newFilePath>');
        }
        break;
      case 'rm':
        if (args.length === 1) {
          await this.fs.remove(args[0]);
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: rename <filePath>');
        }
        break;
      case 'os':
        await this.os.command(args[0]);
        break;
      case 'hash':
        if (args.length === 1) {
          await this.crypto.hash(path.join(this.fs.currentDir, args[0]));
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: hash <filePath>');
        }
        break;
      case 'compress':
        if (args.length === 2) {
          await this.zip.compress(path.join(this.fs.currentDir, args[0]), path.join(this.fs.currentDir, args[1]));
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: mv <filePath> <newFilePath>');
        }
        break;
      case 'decompress':
        if (args.length === 2) {
          await this.zip.decompress(path.join(this.fs.currentDir, args[0]), path.join(this.fs.currentDir, args[1]));
        } else {
          this.log.error('Invalid input');
          this.log.default('Usage: mv <filePath> <newFilePath>');
        }
        break;
      case '.exit':
        this.exit();
        break;
      default:
        this.log.error('Invalid input');
    }
  }

  exit() {
    process.exit();
  }
}

export default Command;
