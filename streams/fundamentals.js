import { Readable, Transform, Writable } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
        return;
      } else {
        const buf = Buffer.from(i.toString());
        this.push(buf);
      }
    }, 1000);
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    const num = parseInt(chunk.toString());
    console.log(num * 10);
    callback();
  }
}

class NegativeNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const num = parseInt(chunk.toString());
    const transformed = -num;
    const buf = Buffer.from(transformed.toString());
    callback(null, buf);
  }
}

// new OneToHundredStream().pipe(process.stdout);

// new OneToHundredStream().pipe(new MultiplyByTenStream());

new OneToHundredStream()
  .pipe(new NegativeNumberStream())
  .pipe(new MultiplyByTenStream());
