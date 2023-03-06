const http = require('http')
const client = require('prom-client')
const Url = require('url-parse');

const register = new client.Registry()

register.setDefaultLabels({
    app: 'example-nodejs-app'
})

const counter = new client.Counter({
    name: 'my_custom_super_name',
    help: 'metric_help',
});
register.registerMetric(counter)


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

const server = http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
        res.setHeader('Content-Type', register.contentType)
        return res.end(await register.metrics())
    } else if(req.url !== '/favicon.ico'){
        counter.inc();
    }
    const arr = queryParser(req.url);
    const result = sort(arr);
    res.end(result.toString())
})

server.listen(3000)