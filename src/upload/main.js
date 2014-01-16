var $ = require('jquery');
var inherits = require('inherits');
var Content = require('streamhub-sdk/content');
var Readable = require('stream/readable');
var Util = require('streamhub-sdk/util');
var View = require('streamhub-sdk/view');

'use strict';

var _picker = null;

/**
 * A view that handles the display of and data returned by FilePicker.
 * Parasitically inherits from Readable, allowing it to pipe returned data
 * to a Writable.
 * @param [key] {string} API key to use with FilePicker.io
 * @param [opts] {Object}
 * @param [opts.api] {{key: !string, cache: !string}} If you intend to use
 *      a different api key, you will also need to provide the cache url.
 * @param [opts.name] {string} Assigned to provider_name for returned data
 * @param [doc] {Element} Document element to render within
 * @constructor
 * @extends {View}
 */
var Upload = function(opts, doc) {
    opts = opts || this.DEFAULT_OPTS;
    View.call(this, opts);
    Readable.call(this, opts);
    if (opts.api) {
        this._apiKey = opts.api.key;
        this._cacheUrl = opts.api.cache;
    }
    this.name = opts.name || this.name;
    this.opts = opts;
    
    var src = this.opts.src;
    
    if (_picker) {
        return this;
    }
    
    Util.loadScript(src, function(err) {
        if (err) {
            _picker = false;
            throw 'There was an error loading ' + src;
        }
        
        _picker = filepicker;
        _picker.setKey(this._apiKey);
    }.bind(this), doc);
};
inherits(Upload, View);
inherits.parasitically(Upload, Readable);

/**
 * Some implementation is required by the abstract Readable.
 * @override
 * @protected
 */
Upload.prototype._read = function() {};

/**
 * privider_name attribute assigned to written data
 * @type {!string}
 */
Upload.prototype.name = 'StreamhubUpload';

/**
 * Key for FilePicker API.
 * @type {!string}
 * @private
 */
Upload.prototype._apiKey = 'AtvGm2B6RR9mDKb8bImIHz';

/**
 * The URL where uploads are cached
 * @type {!string}
 * @private
 */
Upload.prototype._cacheUrl = 'http://dazfoe7f6de09.cloudfront.net/';

/**
 * The default options for using FilePicker and pickAndStore
 * @type {!Object}
 */
Upload.prototype.DEFAULT_OPTS = {
    pick: {
        'container': 'modal',
        'maxSize': 4*1024*1024, // allows files < 4MB
        'mimetypes': ['image/*'],
        'multiple': true,
        'services': ['COMPUTER', 'WEBCAM', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM', 'FLICKR', 'PICASA', 'BOX', 'DROPBOX', 'GOOGLE_DRIVE']
    },
    store: {
        'location': 'S3',
        'access': 'public'
    },
    src: '//api.filepicker.io/v1/filepicker.js'
};

/**
 * Default callback to pickAndStore()
 * @param [err] {Object}
 * @param [inkBlob] {Object}
 */
Upload.prototype.onStore = function (err, inkBlob) {
    if (err) {
        console.log('ERROR!', err);//DEBUG (joao)
        throw 'There was an error storing the file.';
        return;
    }
    
    console.log('Success!');//DEBUG (joao)
    var contentToWrite = new Content({
        body: ''
    });
    inkBlob && inkBlob.forEach(function (blob) {
        var url = this._cacheUrl + blob.key;
        contentToWrite.attachments.push({
            type: 'photo',
            url: url,
            link: url,
            provider_name: this.name
        });
    }, this);
    
    this.push(contentToWrite);
};

/**
 * Displays FilePicker view for uploading objects. Data is passed to the callback.
 * @param [callback] {function(Object, Object)} Optional. Default is this.onStore
 */
Upload.prototype.pickAndStore = function(callback) {
    if (_picker === false) {
        throw 'The FilePicker script failed to load correctly.';
    }
    
    if (_picker === null) {
    //Hasn't loaded yet
        //TODO (joao) Test this
        debugger
        setTimeout(function() {
            this.pickAndStore(callback);
        }.bind(this), 150);
        return;
    }
    
    callback = callback || this.onStore;
    var successFn = function(inkBlob) {
        callback.call(this, undefined, inkBlob);
    }.bind(this);
    var errorFn = function(error) {
        callback.call(this, error);
    }.bind(this);
    _picker.pickAndStore(this.opts.pick, this.opts.store, successFn, errorFn);
};

module.exports = Upload;