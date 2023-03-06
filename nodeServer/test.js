const curl = require('curlrequest');
const util = require('util');
const rp = util.promisify(curl.request);

const start = async () => {
    const options = { url: 'localhost:3000', include: true };
    const r = await rp(options);
    const parts = r.split('\r\n');
    const data = parts.pop()
        , head = parts.pop();
}
// start()
setInterval(start, 100);