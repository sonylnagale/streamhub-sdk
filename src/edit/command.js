var AuthRequiredCommand = require('streamhub-sdk/command/Auth-Required-Command');
var inherits = require('inherits');
var log = require('streamhub-sdk/debug')
        ('streamhub-sdk/edit/command');
var Edit = require('streamhub-sdk/edit');
var Writable = require('stream/writable');

'use strict';

/**
 * @param [fn] {function} Option function to replace the default function.
 * @param [collection] {Collection} The collection for the Edit to pipe to.
 * @param [opts] {Object}
 * @param [opts.callback] {function(err: Object, data: Object)}
 *      Called when the modal view has accomplished its goal.
 * @param [opts.edit} {Edit} Edit to use in-place of default construction.
 * @constructor
 * @extends {AuthRequiredCommand}
 */
var EditCommand = function(fn, collection, opts) {
    opts = opts || {};
    fn = fn || cmd;
    AuthRequiredCommand.call(this, fn);
    
    var edit = this.edit = (opts.edit) ? opts.edit : new Edit({
        collection: collection,
        
    });
    
    var self = this;
    function cmd(clbk) {
        edit.launchModal(clbk || self.done || function () {});
        //TODO (joao) Replace function () {} with a util.nullFunction
    }
};
inherits(EditCommand, AuthRequiredCommand);

/**
 * Callback for view is done with whatever it's doing.
 * @param [err] {Object}
 * @param [data] {Object}
 */
EditCommand.prototype.done = function (err, data) {
    //Implementation isn't necessary, but recommended in most cases.
    log('done() was called without a practical implementation.');
};

module.exports = EditCommand;
