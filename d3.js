#!/usr/bin/env node

var request = require('request'),
    w3org = 'http://validator.w3.org/check';

function check (url, callback) {
    var form;

    form = request.post({
        uri: w3org,
        headers: {
            'User-Agent': 'keis w3 check client',
            'Accept': 'application/json'
        }
    }, function (error, resp, body) {
        callback(error, body)
    }).form();

    form.append('output', 'json')
    form.append('uploaded_file', request(url), {
        contentType: 'text/html'
    });
}

!module.parent && (function main () {
    var argv = require('optimist')
        .demand(1).usage('$0 <url>')
        .argv

    check(argv._.shift(), function (error, result) {
        var data,
            path;

        if (error) {
            console.log('Something went wrong: ' + error)
            return;
        }

        data = JSON.parse(result);
        path = data.url;
        data.messages.forEach(function (message) {
            console.log(message.type + ' ' + path + ':' + message.lastLine + '> ' + message.message);
        });
    });
}());
