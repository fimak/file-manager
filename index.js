import readline from 'node:readline/promises';
import process from 'node:process';
import Auth from './src/Auth.js';
import Command from './src/Command.js';

const main = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const auth = new Auth(rl);
  await auth.start();

  const command = new Command(rl);
  await command.prompt();
}

await main();
