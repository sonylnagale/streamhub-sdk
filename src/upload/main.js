var $ = require('jquery');
var inherits = require('inherits');
var Content = require('streamhub-sdk/content');
var Readable = require('stream/readable');
var Util = require('streamhub-sdk/util');
var View = require('streamhub-sdk/view');

'use strict';

var _picker = null;
var Upload = function(key, opts, doc) {
    View.call(this, opts);
    Readable.call(this, opts);
    this._key = key || Upload.API_KEY;
    this.opts = opts || this.DEFAULT_OPTS;
    var src = this.opts.src;
    
    if (_picker) {
        return this;
    }
    
    Util.loadScript(src, function(err) {
        if (err) {
            throw 'There was an error loading ' + src;
            return;
        }
        
        _picker = filepicker;
        _picker.setKey(this._key);
    }.bind(this), doc);
};
inherits(Upload, View);
inherits.parasitically(Upload, Readable);

Upload.prototype._read = function() {};

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

Upload.prototype.onStore = function (err, inkBlob) {
    if (err) {
        throw 'There was an error storing the file.';
        console.log('ERROR!', err);//DEBUG (joao)
        return;
    }
    
    console.log('Success!');//DEBUG (joao)
    var contentToWrite = new Content({
        body: ''
    });
    inkBlob && inkBlob.forEach(function (blob) {
        contentToWrite.attachments.push({
            type: 'photo',
            url: blob.url
        });
    }, this);
    
    this.push(contentToWrite);
};

Upload.API_KEY = 'AtvGm2B6RR9mDKb8bImIHz';
Upload.CACHE_URL = 'http://dazfoe7f6de09.cloudfront.net/';

Upload.prototype.pickAndStore = function(callback) {
    if (!_picker) {
        throw 'The FilePicker script hasn\'t loaded correctly.';
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