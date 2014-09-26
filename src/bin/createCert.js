#!/usr/bin/env node

var fs = require('fs');
var pem = require('pem');

var days = 1;
if(process.argv.length >= 3){
    days = process.argv[2];
}

var keyFile = 'env/server.key';
var crtFile = 'env/server.crt';
if(process.argv.length >= 5){
    keyFile = '' + process.argv[3];
    crtFile = '' + process.argv[4];
}

console.log("Generating self-signed certificate, good for " + days + " days.");
pem.createCertificate({days:days, selfSigned:true}, function(err, keys){
    if(err){ throw err; }
    console.log(
        'Certificate generated, writing to ' + keyFile + ', '  + crtFile + '.'
    );

    fs.writeFile(
        keyFile, keys.serviceKey,
        {
            endoding: 'utf-8'
        },
        function(err){
            if(err){ throw err; }
            fs.writeFile(
                crtFile, keys.certificate,
                {endoding: 'utf-8'},
                function(err){
                    if(err){ throw err; }
                    console.log("Created keys.");
                }
            );
        }
    );
});
