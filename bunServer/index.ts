import Url from 'url-parse';

let counter = 0
const metricName = 'my_custom_super_name'

const isSorted = arr => arr.every((v,i,a) => !i || a[i-1] <= v);
const sort = array => {
    const arr = JSON.parse(JSON.stringify(array))
    while(!isSorted(arr)) {
        const i1 = Math.floor(Math.random()*arr.length);
        const i2 = Math.floor(Math.random()*arr.length);
        const t = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = t;
    }
    return arr
}

const queryParser = (url) => {
    const { query } = new Url(url);
    return query.split('=')[1].split(',')
}

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        if (req.url.includes(`/metrics`)) {
            // Return all metrics the Prometheus exposition format
            return new Response(`${metricName}{app="example-nodejs-app"} ${counter}`);
        } else if(!req.url.includes('/favicon.ico')){
            counter++;
        }
        const arr = queryParser(req.url);
        const result = sort(arr);
        return new Response(result.toString());
    },
});

console.log(`Listening on http://localhost:${server.port}...`);