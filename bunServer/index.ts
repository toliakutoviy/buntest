let counter = 0
const metricName = 'my_custom_super_name'
const server = Bun.serve({
    port: 3000,
    fetch(req) {
        if (req.url.includes(`/metrics`)) {
            // Return all metrics the Prometheus exposition format
            return new Response(`${metricName}{app="example-nodejs-app"} ${counter}`);
        } else if(req.url !== 'http://localhost:3000/favicon.ico'){
            counter++;
        }
        return new Response(`Bun!`);
    },
});

console.log(`Listening on http://localhost:${server.port}...`);