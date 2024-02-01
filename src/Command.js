import os from 'node:os';
import process from 'node:process';
import Log from './Log.js';

class Command {
  constructor(readline) {
    this.rl = readline;
    this.currentDir = os.homedir();
    this.log = new Log();
    this.log.default(`You are currently in ${this.currentDir}`);
  }

  async prompt() {
    try {
      const input = await this.rl.question('\nEnter a command: ');
      await this.process(input);

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
          this.cd(args[0]);
        } else {
          console.log('Usage: cd <directory>');
        }
        break;
      case 'ls':
        this.ls();
        break;
      case '.exit':
        this.exit();
        break;
      default:
        this.log.error('Invalid input');
    }
  }

  up() {
    const parts = this.currentDir.split(os.platform() === 'win32' ? '\\' : '/');
    if (parts.length > 1) {
      parts.pop();
      this.currentDir = parts.join(os.platform() === 'win32' ? '\\' : '/');
    }
    this.log.success(`Current directory: ${this.currentDir}`);
  }

  cd(directory) {
    this.log.success(`Changing directory to: ${directory}`);
  }

  ls() {
    this.log.success('Listing files and folders:');
  }

  exit() {
    process.exit();
  }
}

export default Command;
