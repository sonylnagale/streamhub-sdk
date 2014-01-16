var AuthRequiredCommand = require('streamhub-sdk/command/Auth-Required-Command');
var inherits = require('inherits');
var Upload = require('streamhub-sdk/upload');
var Writable = require('stream/writable');

'use strict';

var UploadCommand = function(fn, collection) {
    var self = this;
    fn = fn || cmd;
    AuthRequiredCommand.call(this, fn);
    
    var upload = new Upload();
    upload.pipe(collection);
    
    function cmd() {
//        debugger
        upload.pickAndStore(callback);
    };
    
    function callback(err, data) {
        upload.onStore(err, data);
        self.onDone(err, data);
    };
};
inherits(UploadCommand, AuthRequiredCommand);

//UploadCommand.prototype.canExecute = function() { return true; };//DEBUG (joao)

UploadCommand.prototype.onDone = function (err, data) {
    //Abstract
};

module.exports = UploadCommand;