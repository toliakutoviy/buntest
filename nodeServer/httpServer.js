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

const bblSort = (arr) => {
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < ( arr.length - i -1 ); j++){
            if(arr[j] > arr[j+1]){
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j+1] = temp
            }
        }
    }
}

const randomArray = n => {
    const r = [];
    for (let i = 0; i < n; i++) {
        r.push(Math.floor(Math.random()*n))
    }
    return r
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
        res.setHeader('Content-Type', register.contentType)
        return res.end(await register.metrics())
    } else if(req.url !== '/favicon.ico'){
        counter.inc();
    }
    const arr = randomArray(1000 * 15);
    bblSort(arr);
    res.end(arr.length.toString())
})

server.listen(3000)