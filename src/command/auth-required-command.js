var Auth = require('streamhub-sdk/auth');
var Command = require('streamhub-sdk/command');
var inherits = require('inherits');

'use strict';

var AuthRequiredCommand = function(fn) {
    Command.call(this, fn);
};
inherits(AuthRequiredCommand, Command);

AuthRequiredCommand.prototype.execute = function() {
    if (Auth.getToken()) {
        this._execute();
        return;
    }
    
    this.authenticate();
};

AuthRequiredCommand.prototype.authenticate = function() {
    //Abstract
};

module.exports = AuthRequiredCommand;