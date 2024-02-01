class Log {
  constructor() {
    this.redColor = '\x1b[31m%s\x1b[0m';
    this.greenColor = '\x1b[32m%s\x1b[0m';
    this.blueColor = '\x1b[34m%s\x1b[0m';
  }

  error(msg) {
    console.error(this.redColor, msg);
  }

  success(msg) {
    console.log(this.greenColor, msg);
  }

  default(msg) {
    console.log(this.blueColor, msg);
  }
}

export default Log;
