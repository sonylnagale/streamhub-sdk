var Auth = require('streamhub-sdk/auth');
var Command = require('streamhub-sdk/command');
var inherits = require('inherits');
var log = require('streamhub-sdk/debug')
        ('streamhub-sdk/command/auth-required-command');

'use strict';

/**
 * @param [fn] {function} Option function to replace the default function.
 * @param [opts] {Object}
 * @param [opts.allowAuth] {boolean} Default is true. Specify false to disable
 *      the command and prevent authentication prompts.
 * @constructor
 * @extends {Command}
 */
var AuthRequiredCommand = function (fn, opts) {
    opts = opts || {};
    this._allowAuth = opts.allowAuth !== false;
    Command.call(this, fn);
    
    if (!this._allowAuth) {
        this.disable();
    };
};
inherits(AuthRequiredCommand, Command);

/**
 * Execute the Command
 * @override
 */
AuthRequiredCommand.prototype.execute = function () {
    if (Auth.getToken()) {
        return this.canExecute() && Command.prototype.execute.apply(this, arguments);
    }
    
    this._allowAuth && this._authenticate();
};

/**
 * @type {!boolean}
 * @private
 */
AuthRequiredCommand.prototype._allowAuth = true;

/**
 * Check whether auth-authentication is allowed.
 * @returns {!boolean}
 */
AuthRequiredCommand.prototype.allowAuth = function () {
    return this._allowAuth;
};

/**
 * @protected
 */
AuthRequiredCommand.prototype._authenticate = function () {
    if (!this.allowAuth_) {
        log('Attempt to _authenticate() thwarted by !allowAuth_', this);
        return;
    }
    
    //Sorta abstracty stub
};

module.exports = AuthRequiredCommand;