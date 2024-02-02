import { arch, cpus, EOL, homedir, userInfo } from 'node:os';
import Log from './Log.js';

class OS {
  constructor() {
    this.log = new Log();
  }

  async command(arg) {
    console.log(arg);
    if (arg && arg.startsWith('--')) {
      const cmd = arg.slice(2);

      switch (cmd) {
        case 'EOL':
          const shieldedEol = EOL === '\r\n' ? '\\r\\n' : EOL === '\r' ? '\\r' : '\\n';
          this.log.success(shieldedEol);
          break;
        case 'cpus':
          const cpuInfo = cpus();
          this.log.success(`${cpuInfo[0].model} ${cpuInfo.length} cores`);
          break;
        case 'homedir':
          this.log.success(homedir());
          break;
        case 'username':
          this.log.success(userInfo().username);
          break;
        case 'architecture':
          this.log.success(arch());
          break;
        default:
          this.log.error('Invalid input');
          break;
      }
    } else {
      this.log.error('Invalid input');
      this.log.default('Usage: os --<argument>');
    }
  }
}

export default OS;
