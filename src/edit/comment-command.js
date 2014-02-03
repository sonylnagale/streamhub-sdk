var AuthRequiredCommand = require('streamhub-sdk/command/Auth-Required-Command');
var inherits = require('inherits');
var log = require('streamhub-sdk/debug')
        ('streamhub-sdk/edit/comment-command');
var Edit = require('streamhub-sdk/edit');
var Readable = require('stream/readable');
var Writable = require('stream/writable');

'use strict';

/**
 * @param [fn] {function} Optional function to replace the default function.
 * @param source {!Readable} Object that can be read from.
 *          Function that returns comment data as Content.
 * @param destination {!Writable} The writable to post to, typically a Collection.
 * @param [opts] {Object}
 * @param [opts.callback] {function(err: Object, data: Object} Callback after attempting to post comment.
 * @constructor
 * @extends {AuthRequiredCommand}
 */
var CommentCommand = function(fn, source, destination, opts) {
    opts = opts || {};
    fn = fn || cmd;
    AuthRequiredCommand.call(this, fn);
    
    /**
     * The source to read() from.
     * @type {!Readable}
     * @protected
     */
    this._source = source;
    
    /**
     * The destination to write() to.
     * @type {!Writable}
     * @protected
     */
    this._destination = destination;
    
    if (!this._destination || !this._source) {
        this.emit('change:canExecute', this.canExecute());
        throw 'A source and destination are required when constructing a CommentCommand.';
    }
    
    this.callback = opts.callback || this.callback;
    
    var self = this;
    function cmd(clbk) {
        var data = self._source.read();
        data && self._destination.write(data, clbk || self.callback || function () {});
        //TODO (joao) Replace function () {} with a util.nullFunction
    }
};
inherits(CommentCommand, AuthRequiredCommand);

/** @override */
CommentCommand.prototype.canExecute = function () {
    if (!AuthRequiredCommand.prototype.canExecute.apply(this, arguments)) {
        return false;
    }
    
    if (!this._destination || !this._source) {
        log('Can\'t execute without this.destination and this.source.');
        return false;
    }
    
    return true;
};

/**
 * Handle response from posting comment.
 * Custom implementation is recommended, either by specifying opts.callback
 * during construction or by overriding this method.
 * @param [err] {Object}
 * @param [data] {Object}
 */
CommentCommand.prototype.callback = function callback(err, data) {
    //Implementation isn't necessary, but recommended in most cases.
    log('callback() was called without a practical implementation.');
};

module.exports = CommentCommand;
