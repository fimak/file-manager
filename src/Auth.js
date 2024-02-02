import process from 'node:process';
import readline from 'node:readline/promises';
import Log from './Log.js';

class Auth {
  constructor() {
    this.username = process.argv.find((el) => el.startsWith('--username='))?.slice(11);
    this.log = new Log();
  }

  async start(){
    if (!this.username) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      this.username = await this.rl.question('Please enter your name: ');
      this.rl.on('SIGINT', () => {
        process.exit();
      });
      this.rl.close();

      process.on('exit', () => {
        this.log.default(`\nThank you for using File Manager, ${this.username}, goodbye!`);
      });
    }
    this.log.success(`Welcome to the File Manager, ${this.username}!`);
  }
}

export default Auth;
