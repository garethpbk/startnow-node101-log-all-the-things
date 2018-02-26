const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

var logInitialData = 'Agent, Time, Method, Resource, Version, Status\n';
var logs = [];

/* fs.writeFile('log.csv', logInitialData, function (error) {
    if (error) throw error;
}); */

app.use((req, res, next) => {

    var logObj = function (agent, time, method, resource, version, status) {
        this.Agent = agent;
        this.Time = time;
        this.Method = method;
        this.Resource = resource;
        this.Version = version;
        this.Status = status;
    }

    var logAgent = req.headers['user-agent'].replace(/,/g, ' ');
    var logTime = new Date().toISOString();
    var logMeth = req.method;
    var logRsc = req.path;
    var logVer = req.httpVersion;
    var logStat = res.statusCode;

    var logData = logAgent + ',' + logTime + ',' + logMeth + ',' + logRsc + ',HTTP/' + logVer + ',' + logStat + '\n';
    var newLogEntry = new logObj(logAgent, logTime, logMeth, logRsc, logVer, logStat);
    logs.push(newLogEntry);

// write your logging code here
    fs.appendFile('log.csv', logData, function(error) {
        if (error) throw error;
        console.log(logData);
        console.log('wrote log.csv');
    });
    /* res.send(logData); */
    next();
});



app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    console.log(res);
    res.end('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    res.send(logs);
});

module.exports = app;
