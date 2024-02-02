import Auth from './src/Auth.js';
import Command from './src/Command.js';

const main = async () => {
  const auth = new Auth();
  await auth.start();

  const command = new Command();
  await command.prompt();
}

await main();
