import fs from 'node:fs';
import zlib from 'zlib';
import Log from './Log.js';

class Zip {
  constructor() {
    this.log = new Log();
  }

  async compress(input, output) {
    try {
      const readStream = fs.createReadStream(input);
      const writeStream = fs.createWriteStream(output);
      const compressStream = zlib.createGzip();

      readStream
        .pipe(compressStream)
        .pipe(writeStream);

      this.log.success(`File ${input} successfully compressed to ${output}!`);
    } catch (err) {
      this.log.error('Invalid input');
    }
  }

  async decompress(input, output) {
    try {
      const readStream = fs.createReadStream(input);
      const writeStream = fs.createWriteStream(output);
      const decompressStream = zlib.createGunzip();

      readStream
        .pipe(decompressStream)
        .pipe(writeStream);

      this.log.success(`File ${input} successfully decompressed to ${output}!`);
    } catch (err) {
      this.log.error('Invalid input');
    }
  }
}

export default Zip;
