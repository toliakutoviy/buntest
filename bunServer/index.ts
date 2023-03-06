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

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        if (req.url.includes(`/metrics`)) {
            // Return all metrics the Prometheus exposition format
            return new Response(`${metricName}{app="example-nodejs-app"} ${counter}`);
        } else if(!req.url.includes('/favicon.ico')){
            counter++;
        }
        const arr = randomArray(1000 * 15);
        bblSort(arr);
        return new Response(arr.length.toString());
    },
});

console.log(`Listening on http://localhost:${server.port}...`);