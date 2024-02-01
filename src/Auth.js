import process from 'node:process';
import Log from './Log.js';

class Auth {
  constructor(readline) {
    this.rl = readline;
    this.username = process.argv.find((el) => el.startsWith('--username='))?.slice(11);
    this.log = new Log();
    this.rl.on('SIGINT', () => {
      process.exit();
    });
    process.on('exit', () => {
      this.log.default(`\nThank you for using File Manager, ${this.username}, goodbye!`);
    });
  }

  async start(){
    if (!this.username) {
      this.username = await this.rl.question('Please enter your name: ');
    }
    this.log.success(`Welcome to the File Manager, ${this.username}!`);
  }
}

export default Auth;
