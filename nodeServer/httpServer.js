const http = require('http')
const client = require('prom-client')

// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'example-nodejs-app'
})

// Create a histogram metric
const counter = new client.Counter({
    name: 'my_custom_super_name',
    help: 'metric_help',
});
// Register the histogram
register.registerMetric(counter)

// Define the HTTP server
const server = http.createServer(async (req, res) => {
    // Retrieve route from request object

    if (req.url === '/metrics') {
        // Return all metrics the Prometheus exposition format
        res.setHeader('Content-Type', register.contentType)
        return res.end(await register.metrics())
    } else if(req.url !== '/favicon.ico'){
        counter.inc();
    }
    res.end('hello world')
})

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(3000)