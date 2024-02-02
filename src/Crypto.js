import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import Log from './Log.js';

class Crypto {
  constructor() {
    this.log = new Log();
  }

  async hash(filePath) {
    try {
      const fileHandler = await fs.readFile(filePath, { encoding: 'utf-8' });
      const sha256 = createHash('sha256');
      sha256.update(fileHandler);
      const fileHash = sha256.digest('hex');
      process.stdout.write(`${fileHash}\n`);
    } catch(err) {
      this.log.error('Invalid input');
    }
  }
}

export default Crypto;
