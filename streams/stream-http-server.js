import http from "node:http";
import { Transform } from "node:stream";

class NegativeNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const num = parseInt(chunk.toString());
    const transformed = -num;
    const buf = Buffer.from(transformed.toString());
    console.log(transformed);
    callback(null, buf);
  }
}

const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buffers).toString();
  console.log(fullStreamContent);

  return res.end(fullStreamContent);
  // return req.pipe(new NegativeNumberStream()).pipe(res);
});

server.listen(3334);
